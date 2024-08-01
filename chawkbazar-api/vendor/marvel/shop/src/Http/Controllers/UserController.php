<?php

namespace Marvel\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Marvel\Database\Repositories\UserRepository;
use Marvel\Database\Repositories\BusinessProfileRepository;
use Marvel\Database\Repositories\ShopRepository;
use Illuminate\Validation\ValidationException;
use Marvel\Database\Models\User;
use Marvel\Database\Models\BusinessProfile;
use Illuminate\Support\Facades\Hash;
use Marvel\Http\Requests\UserCreateRequest;
use Marvel\Http\Requests\UserUpdateRequest;
use Marvel\Enums\Permission;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Marvel\Database\Models\Profile;
use Marvel\Http\Requests\ChangePasswordRequest;
use Marvel\Mail\ContactAdmin;
use Marvel\Otp\Gateways\OtpGateway;
use Marvel\Database\Models\Permission as ModelsPermission;
use Marvel\Exceptions\MarvelException;

class UserController extends CoreController
{
    public $repository;
    protected $businessProfileRepository;
    protected $shopRepository;

    public function __construct(UserRepository $repository, BusinessProfileRepository $businessProfileRepository, ShopRepository $shopRepository)
    {
        $this->repository = $repository;
        $this->businessProfileRepository = $businessProfileRepository;
        $this->shopRepository = $shopRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?   $request->limit : 15;
        $page = $request->page ?   $request->page : 1;
        $users = $this->repository->with(['profile', 'address'])->paginate($limit);
        $business_profiles = $this->businessProfileRepository->all();
        $shops = $this->shopRepository->all();
        foreach($users->all() as $user)
        {
            $user->business_profile = $business_profiles->where("user_id","=",$user->id);
            $user->shops = $shops->where("owner_id","=",$user->id);
        }
        return $users;
    }

    /**
     * Store a newly created resource in storage.
     *Í
     * @param UserCreateRequest $request
     * @return bool[]
     */
    public function store(UserCreateRequest $request)
    {
        return $this->repository->storeUser($request);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return array
     */
    public function show($id)
    {
        try {
            $user = $this->repository->with(['profile', 'address', 'shop', 'managed_shop'])->findOrFail($id);
            return $user;
        } catch (Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    public function showWithProfileAndAddress($id)
    {
        try {
            $user = $this->repository->with(['profile', 'address'])->findOrFail($id);
            $business_profiles = $this->businessProfileRepository->all();
            $user->business_profile = $business_profiles->where("user_id","=",$user->id);
            return $user;
        } catch (Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserUpdateRequest $request
     * @param int $id
     * @return array
     */
    public function update(UserUpdateRequest $request, $id)
    {
        if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
            $user = $this->repository->findOrFail($id);
            return $this->repository->updateUser($request, $user);
        } elseif ($request->user()->id == $id) {
            $user = $request->user();
            return $this->repository->updateUser($request, $user);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return array
     */
    public function destroy($id)
    {
        try {
            return $this->repository->findOrFail($id)->delete();
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if (isset($user)) {
            $usertosend = $this->repository->with(['profile', 'address', 'shops.balance', 'managed_shop.balance'])->find($user->id);
            $business_profiles = $this->businessProfileRepository->all();
            $usertosend->business_profile = $business_profiles->where("user_id","=",$usertosend->id);
            return $usertosend;
        }
        throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
    }

    public function token(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->where('is_active', true)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
          
            return ["token" => null, "permissions" => []];
        }
        return ["token" => $user->createToken('auth_token')->plainTextToken, "permissions" => $user->getPermissionNames()];
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return true;
        }
        return $request->user()->currentAccessToken()->delete();
    }

    public function register(UserCreateRequest $request)
    {
        $permissions = [Permission::CUSTOMER];
        if (isset($request->permission)) {
            $permissions[] = isset($request->permission->value) ? $request->permission->value : $request->permission;
        }
        $user = $this->repository->create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);
        if(isset($request->permission) && $request->permission == "store_owner" && isset($user) && $user->email)
        {
            $fromUser=env('MAIL_FROM_ADDRESS','ansh@zweler.com');
            Mail::send('manufacturer-signup',["user"=>$user],function($messages) use ($fromUser,$user){
            $messages->to($user->email);
            $messages->subject('Welcome to Zweler - Your Gateway to Showcasing Jewellery Excellence!');
            });
        }
        else
        {
            if($request->type && $request->type=="Business")
        {
            $business_profile = $this->businessProfileRepository->create([
                'user_id'        => $user->id,
                'type'      => $request->type,
                'gst'       => $request->gst,
                'mobile'    => $request->mobile,
                'country'   => $request->country,
                'state'     => $request->state,
                'city'      => $request->city,
                'zipcode'   => $request->zipcode,
                'straddress'=> $request->straddress,
                'is_approved'=>$request->is_approved,
                'customer_type'=> $request->customer_type
            ]);
            $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEVEN&to=91'.str_replace('+91', '',$request->mobile).'&text=Hello%20'.str_replace(' ', '%20', $request->name).'%2C%0AThank%20you%20for%20registering%20with%20Zweler%21%20Your%20account%20is%20currently%20being%20processed%2C%20and%20we%20will%20notify%20you%20once%20your%20registration%20is%20approved%20after%20document%20verification.%20Feel%20free%20to%20explore%20our%20platform%20and%20get%20ready%20to%20elevate%20your%20jewellery%20business%21%0ABest%20regards%2C%0ATeam%20Zweler%20-ZWELER&indiaDltContentTemplateId=1107169632532933613&indiaDltPrincipalEntityId=1101660960000072501';
            $crl = curl_init();
            curl_setopt($crl, CURLOPT_URL, $url);
            curl_setopt($crl, CURLOPT_FRESH_CONNECT, true);
            curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($crl, CURLOPT_SSL_VERIFYHOST, false);
            $response = curl_exec($crl);
            if(!$response){
                return $response;
            }
            curl_close($crl);
            if(isset($user) && $user->email)
            {
            $fromUser=env('MAIL_FROM_ADDRESS','ansh@zweler.com');
            Mail::send('retailer-signup',["user"=>$user],function($messages) use ($fromUser,$user){
            $messages->to($user->email);
            $messages->subject('Welcome to Zweler - Account Registration Received');
            });
        }
        }
        else if(isset($user) && $user->email)
        {
            $fromUser=env('MAIL_FROM_ADDRESS','ansh@zweler.com');
            Mail::send('consumer-signup',["user"=>$user],function($messages) use ($fromUser,$user){
            $messages->to($user->email);
            $messages->subject('Welcome to Zweler - Discover Exceptional Jewellery Designs!');
            });
        }
    }
        // else{

        //     $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEMSG&to=91'.$request->mobile.'&text=Hello%20'.str_replace(' ', '%20', $request->name).'%2C%0AWelcome%20to%20Zweler%21%20You%27ve%20successfully%20registered%2C%20and%20we%27re%20thrilled%20to%20have%20you%20as%20part%20of%20our%20community.%20Explore%20a%20world%20of%20exquisite%20jewellery%20and%20find%20the%20perfect%20pieces%20that%20suit%20your%20style%20and%20preferences.%0ABest%20regards%2C%0ATeamZweler%20-ZWELER&indiaDltContentTemplateId=1107169632573034811&indiaDltPrincipalEntityId=1101660960000072501';
        //     $crl = curl_init();
        //     curl_setopt($crl, CURLOPT_URL, $url);
        //     curl_setopt($crl, CURLOPT_FRESH_CONNECT, true);
        //     curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        //            curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
        //curl_setopt($crl, CURLOPT_SSL_VERIFYHOST, false);
        //     $response = curl_exec($crl);
        //     if(!$response){
        //         return $response;
        //     }
        //     curl_close($crl);
        // }



        $user->givePermissionTo($permissions);

        return ["token" => $user->createToken('auth_token')->plainTextToken, "permissions" => $user->getPermissionNames()];
    }

    public function sendManualOtpCode(Request $request)
    {
        $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEMSG&to=91'.str_replace('+91', '',$request->mobile).'&text='.$request->otp.'%20is%20OTP%20for%20verification%20at%20zweler.com.%0AIf%20you%20didn%27t%20initiate%20this%20transaction%2C%20Please%20contact%20our%20support%20team%20immediately%20at%20%2B91-9624177111.%20-ZWELER&indiaDltContentTemplateId=1107169632438587977&indiaDltPrincipalEntityId=1101660960000072501';
        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $url);
        curl_setopt($crl, CURLOPT_FRESH_CONNECT, true);
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($crl, CURLOPT_SSL_VERIFYHOST, false);
        $response = curl_exec($crl);
        if(!$response){
            return $response;
        }
        curl_close($crl);
    }

    public function isUserContactExists(Request $request)
    {
        //return $this->repository->with(['profile'])->all(); //where('profile.contact','=','+918347885611')->first();
        $contact = '+91'.$request->mobile;
        $contact2 = $request->mobile;
        $result = $this->repository->whereHas('profile', function ($query) use ($contact) {
            $query->where('contact', $contact);
        })->with(['profile'])->count();
        $result2 = $this->repository->whereHas('profile', function ($query) use ($contact2) {
            $query->where('contact', $contact2);
        })->with(['profile'])->count();
        $count = $result + $result2;
        if($count > 0)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }
    public function banUser(Request $request)
    {
        $user = $request->user();
        if ($user && $user->hasPermissionTo(Permission::SUPER_ADMIN) && $user->id != $request->id) {
            $banUser =  User::find($request->id);
            $banUser->is_active = false;
            $banUser->save();
            return $banUser;
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }
    public function activeUser(Request $request)
    {
        $user = $request->user();
        if ($user && $user->hasPermissionTo(Permission::SUPER_ADMIN) && $user->id != $request->id) {
            $activeUser =  User::find($request->id);
            $activeUser->is_active = true;
            $activeUser->save();
            return $activeUser;
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function forgetPassword(Request $request)
    {
        $user = $this->repository->findByField('email', $request->email);
        if (count($user) < 1) {
            return ['message' => config('shop.app_notice_domain') . 'MESSAGE.NOT_FOUND', 'success' => false];
        }
        $tokenData = DB::table('password_resets')
            ->where('email', $request->email)->first();
        if (!$tokenData) {
            DB::table('password_resets')->insert([
                'email' => $request->email,
                'token' => Str::random(16),
                'created_at' => Carbon::now()
            ]);
            $tokenData = DB::table('password_resets')
                ->where('email', $request->email)->first();
        }

        if ($this->repository->sendResetEmail($request->email, $tokenData->token)) {
            return ['message' => config('shop.app_notice_domain') . 'MESSAGE.CHECK_INBOX_FOR_PASSWORD_RESET_EMAIL', 'success' => true];
        } else {
            return ['message' => config('shop.app_notice_domain') . 'MESSAGE.SOMETHING_WENT_WRONG', 'success' => false];
        }
    }
    public function verifyForgetPasswordToken(Request $request)
    {
        $tokenData = DB::table('password_resets')->where('token', $request->token)->first();
        $user = $this->repository->findByField('email', $request->email);
        if (!$tokenData) {
            return ['message' => config('shop.app_notice_domain') . 'MESSAGE.INVALID_TOKEN', 'success' => false];
        }
        $user = $this->repository->findByField('email', $request->email);
        if (count($user) < 1) {
            return ['message' => config('shop.app_notice_domain') . 'MESSAGE.NOT_FOUND', 'success' => false];
        }
        return ['message' => config('shop.app_notice_domain') . 'MESSAGE.TOKEN_IS_VALID', 'success' => true];
    }
    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'password' => 'required|string',
                'email' => 'email|required',
                'token' => 'required|string'
            ]);

            $user = $this->repository->where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            DB::table('password_resets')->where('email', $user->email)->delete();

            return ['message' => config('shop.app_notice_domain') . 'MESSAGE.PASSWORD_RESET_SUCCESSFUL', 'success' => true];
        } catch (\Exception $th) {
            return ['message' => config('shop.app_notice_domain') . 'MESSAGE.SOMETHING_WENT_WRONG', 'success' => false];
        }
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $user = $request->user();
            if (Hash::check($request->oldPassword, $user->password)) {
                $user->password = Hash::make($request->newPassword);
                $user->save();
                return ['message' => config('shop.app_notice_domain') . 'MESSAGE.PASSWORD_RESET_SUCCESSFUL', 'success' => true];
            } else {
                return ['message' => config('shop.app_notice_domain') . 'MESSAGE.OLD_PASSWORD_INCORRECT', 'success' => false];
            }
        } catch (\Exception $th) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }
    public function contactAdmin(Request $request)
    {
        try {
            $details = $request->only('subject', 'name', 'email', 'description');
            Mail::to(config('shop.admin_email'))->send(new ContactAdmin($details));
            return ['message' => config('shop.app_notice_domain') . 'MESSAGE.EMAIL_SENT_SUCCESSFUL', 'success' => true];
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function fetchStaff(Request $request)
    {
        if (!isset($request->shop_id)) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
        if ($this->repository->hasPermission($request->user(), $request->shop_id)) {
            return $this->repository->with(['profile'])->where('shop_id', '=', $request->shop_id);
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function staffs(Request $request)
    {
        $query = $this->fetchStaff($request);
        $limit = $request->limit ?? 15;
        return $query->paginate($limit);
    }

    public function socialLogin(Request $request)
    {
        $provider = $request->provider;
        $token = $request->access_token;
        $validated = $this->validateProvider($provider);
        if (!is_null($validated)) {
            return $validated;
        }
        try {
            $user = Socialite::driver($provider)->userFromToken($token);
            $userCreated = User::firstOrCreate(
                [
                    'email' => $user->getEmail()
                ],
                [
                    'email_verified_at' => now(),
                    'name' => $user->getName(),
                ]
            );
            $userCreated->providers()->updateOrCreate(
                [
                    'provider' => $provider,
                    'provider_user_id' => $user->getId(),
                ]
            );

            $avatar = [
                'thumbnail' => $user->getAvatar(),
                'original' => $user->getAvatar(),
            ];

            $userCreated->profile()->updateOrCreate(
                [
                    'avatar' => $avatar
                ]
            );

            if (!$userCreated->hasPermissionTo(Permission::CUSTOMER)) {
                $userCreated->givePermissionTo(Permission::CUSTOMER);
            }

            return ["token" => $userCreated->createToken('auth_token')->plainTextToken, "permissions" => $userCreated->getPermissionNames()];
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.INVALID_CREDENTIALS');
        }
    }

    protected function validateProvider($provider)
    {
        if (!in_array($provider, ['facebook', 'google'])) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.PLEASE_LOGIN_USING_FACEBOOK_OR_GOOGLE');
        }
    }

    protected function getOtpGateway()
    {
        $gateway = config('auth.active_otp_gateway');
        $gateWayClass = "Marvel\\Otp\\Gateways\\" . ucfirst($gateway) . 'Gateway';
        $otpGateway = new OtpGateway(new $gateWayClass());
        return $otpGateway;
    }

    protected function verifyOtp(Request $request)
    {
        $id = $request->otp_id;
        $code = $request->code;
        $phoneNumber = $request->phone_number;
        try {
            $otpGateway = $this->getOtpGateway();
            $verifyOtpCode = $otpGateway->checkVerification($id, $code, $phoneNumber);
            if ($verifyOtpCode->isValid()) {
                return true;
            }
            return false;
        } catch (\Throwable $e) {
            return false;
        }
    }

    public function sendOtpCode(Request $request)
    {
        $phoneNumber = $request->phone_number;
        try {
            if(empty($phoneNumber)){
                return ['message' => config('shop.app_notice_domain') . 'ERROR.EMPTY_MOBILE_NUMBER', 'success' => false];
            }

            $otpGateway = $this->getOtpGateway();
            $sendOtpCode = $otpGateway->startVerification($phoneNumber);
            if (!$sendOtpCode->isValid()) {
                return ['message' => config('shop.app_notice_domain') . 'ERROR.OTP_SEND_FAIL', 'success' => false];
            }
            $profile = Profile::where('contact', $phoneNumber)->first();
            return [
                'message' => config('shop.app_notice_domain') . 'ERROR.OTP_SEND_SUCCESSFUL',
                'success' => true,
                'provider' => config('auth.active_otp_gateway'),
                'id' => $sendOtpCode->getId(),
                'phone_number' => $phoneNumber,
                'is_contact_exist' => $profile ? true : false
            ];
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.INVALID_GATEWAY');
        }
    }

    public function verifyOtpCode(Request $request)
    {
        $id = $request->otp_id;
        $code = $request->code;
        $phoneNumber = $request->phone_number;
        $user_id = $request->user_id;
        try {
            $user = User::find($user_id);
                $user->profile()->updateOrCreate(
                    ['customer_id' => $user_id],
                    [
                        'contact' => $phoneNumber
                    ]
                );
                return [
                    "success" => true,
                ];
        } catch (\Throwable $e) {
        }
    }

    public function otpLogin(Request $request)
    {
        $phoneNumber = $request->phone_number;

        try {
                $profile = Profile::where('contact', $phoneNumber)->first();
                $user = '';
                if (!$profile) {
                    // profile not found so could be a new user
                    $name = $request->name;
                    $email = $request->email;
                    if ($name && $email) {
                        $user = User::firstOrCreate([
                            'email'     => $email
                        ], [
                            'name'    => $name,
                        ]);
                        $user->givePermissionTo(Permission::CUSTOMER);
                        $user->profile()->updateOrCreate(
                            ['customer_id' => $user->id],
                            [
                                'contact' => $phoneNumber
                            ]
                        );
                    } else {
                        return ['message' => 'Required information missing!', 'success' => false];
                    }
                } else {
                    $user = User::where('id', $profile->customer_id)->first();
                }
                return [
                    "token" => $user->createToken('auth_token')->plainTextToken,
                    "permissions" => $user->getPermissionNames()
                ];
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Invalid gateway.'], 422);
        }
    }

    public function updateContact(Request $request)
    {
        $phoneNumber = $request->phone_number;
        $user_id = $request->user_id;

        try {
            if ($this->verifyOtp($request)) {
                $user = User::find($user_id);
                $user->profile()->updateOrCreate(
                    ['customer_id' => $user_id],
                    [
                        'contact' => $phoneNumber
                    ]
                );
                return [
                    "message" => 'Contact update successful!',
                    "success" => true,
                ];
            }
            return ['message' => 'Contact update failed!', 'success' => false];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid gateway.'], 422);
        }
    }
}
