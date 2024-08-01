<?php

namespace Marvel\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Product;
use Marvel\Database\Repositories\ShopRepository;
use Marvel\Database\Models\BusinessProfile;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\ShopCreateRequest;
use Marvel\Http\Requests\ShopUpdateRequest;
use Marvel\Http\Requests\UserCreateRequest;
use Marvel\Database\Repositories\BusinessProfileRepository;
use Mail;


class ShopController extends CoreController
{
    public $repository;
    protected $businessProfileRepository;

    public function __construct(ShopRepository $repository, BusinessProfileRepository $businessProfileRepository)
    {
        $this->repository = $repository;
        $this->businessProfileRepository = $businessProfileRepository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Shop[]
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?  $request->limit : 15;
        return $this->fetchShops($request)->paginate($limit)->withQueryString();
    }

    public function fetchShops(Request $request)
    {
        return $this->repository->withCount(['orders', 'products'])->with(['owner.profile'])->where('id', '!=', null);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param ShopCreateRequest $request
     * @return mixed
     */
    public function store(ShopCreateRequest $request)
    {
        if ($request->user()->hasPermissionTo(Permission::STORE_OWNER)) {
            return $this->repository->storeShop($request);
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return JsonResponse
     */
    public function show($slug, Request $request)
    {
        $shop = $this->repository
            ->with(['categories', 'owner'])
            ->withCount(['orders', 'products']);
            $shop = $shop->with('balance');
        try {
            $shop = $shop->findOneByFieldOrFail('slug', $slug);
            return $shop;
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ShopUpdateRequest $request
     * @param int $id
     * @return array
     */
    public function update(ShopUpdateRequest $request, $id)
    {
        $request->id = $id;
        return $this->updateShop($request);
    }

    public function updateShop(Request $request)
    {
        $id = $request->id;
        if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN) || ($request->user()->hasPermissionTo(Permission::STORE_OWNER) && ($request->user()->shops->contains($id)))) {
            return $this->repository->updateShop($request, $id);
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $request->id = $id;
        return $this->deleteShop($request);
    }

    public function deleteShop(Request $request)
    {
        $id = $request->id;
        if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN) || ($request->user()->hasPermissionTo(Permission::STORE_OWNER) && ($request->user()->shops->contains($id)))) {
            try {
                $shop = $this->repository->findOrFail($id);
            } catch (\Exception $e) {
                throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
            }
            $shop->delete();
            return $shop;
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function approveBusiness(Request $request)
    {
        $user_id = $request->user_id;
        $customer_type = $request->customer_type;
        $business_profile = BusinessProfile::firstOrNew(['user_id'=>$user_id]);
        $user = User::findOrFail($user_id);
        $business_profile->customer_type = $customer_type;
            $business_profile->is_approved = 1;
            $business_profile->save();
            $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEMSG&to=91'.str_replace('+91', '',$business_profile->mobile).'&text=Hello%20'.str_replace(' ', '%20', $user->name).'%2C%0AGreat%20news%21%20Your%20account%20on%20Zweler%20is%20now%20approved%21%20You%20can%20start%20exploring%20and%20buying%20the%20finest%20jewellery%20products%20right%20away.%20Discover%20our%20extensive%20collection%20and%20elevate%20your%20business%20with%20us%21%0ABest%20regards%2C%20%0ATeamZweler%20-ZWELER&indiaDltContentTemplateId=1107169632596459847&indiaDltPrincipalEntityId=1101660960000072501';
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
            if(isset($user) && $user->email && isset($business_profile->customer_type) && $business_profile->customer_type == 2)
            {
            $fromUser=env('MAIL_FROM_ADDRESS','ansh@zweler.com');
            Mail::send('retailer-approval',["user"=>$user],function($messages) use ($fromUser,$user){
            $messages->to($user->email);
            $messages->subject('Welcome to Zweler - Your Gateway to Jewellery Retail Excellence!');
            });
        }
            return $business_profile;
    }

    public function approveShop(Request $request)
    {
        $id = $request->id;
        $customer_type = $request->customer_type;
        $vendor_code = $request->vendor_code;
        $admin_commission_rate = $request->admin_commission_rate;
        $admin_commission_rate_solitaire = $request->admin_commission_rate_solitaire;
        $markup_type = $request->markup_type;
        $making_charges_markup = $request->making_charges_markup;
        $wastage_markup = $request->wastage_markup;
        try {
            $shop = $this->repository->findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        $shop->is_active = true;
        $shop->customer_type = $customer_type;
        $shop->markup_type = $markup_type;
        $shop->making_charges_markup = $making_charges_markup;
        $shop->wastage_markup = $wastage_markup;
        $shop->vendor_code = $vendor_code;
        $shop->save();
        $balance = Balance::firstOrNew(['shop_id' => $id]);
        $balance->admin_commission_rate = $admin_commission_rate;
        $balance->admin_commission_rate_solitaire = $admin_commission_rate_solitaire;
        $balance->save();
        if(isset($shop) && $shop->settings["contact"]){
            $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEVEN&to=91'.str_replace('+91', '',$shop->settings["contact"]).'&text=Hello%20'.str_replace(' ', '%20', $shop->name).'%2C%0ACongratulations%21%20Your%20manufacturer%20account%20on%20Zweler%20has%20been%20approved.%20You%20can%20now%20start%20listing%20your%20exquisite%20jewellery%20products%20and%20enjoy%20the%20multiple%20benefits%20of%20our%20platform.%20Reach%20a%20wider%20network%20of%20retailers%20and%20grow%20your%20business%20with%20us%21%0ABest%20regards%2C%0ATeam%20Zweler%20-ZWELER&indiaDltContentTemplateId=1107169632514985043&indiaDltPrincipalEntityId=1101660960000072501';
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
        $user = User::findOrFail($shop->owner_id);
        if(isset($user) && $user->email && $user->name)
        {
            $fromUser=env('MAIL_FROM_ADDRESS','ansh@zweler.com');
            Mail::send('manufacturer-approval',["user"=>$user],function($messages) use ($fromUser,$user){
            $messages->to($user->email);
            $messages->subject('Welcome to Zweler - Showcase Your Jewellery Excellence to the World!');
            });
        }
        return $shop;
    }


    public function disApproveShop(Request $request)
    {
        $id = $request->id;
        try {
            $shop = $this->repository->findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }

        $shop->is_active = false;
        $shop->save();

        Product::where('shop_id', '=', $id)->update(['status' => 'draft']);

        if($shop->settings["contact"]){
            $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEVEN&to=91'.str_replace('+91', '',$shop->settings["contact"]).'&text=Hello%20'.str_replace(' ', '%20', $shop->name).'%2C%0AWe%20regret%20to%20inform%20you%20that%20due%20to%20some%20reasons%20your%20shop%20account%20at%20Zweler%20has%20been%20DEACTIVATED.%20Kindly%20connect%20with%20our%20team%20at%20info%40zweler.com%20or%20call%20us%20on%20%2B91-9624177111%20and%20make%20the%20required%20corrections%20to%20ACTIVATE%20the%20account%20again.%0ABest%20Regards%2C%0ATeam%20Zweler%20-ZWELER&indiaDltContentTemplateId=1107169632488797355&indiaDltPrincipalEntityId=1101660960000072501';
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

        return $shop;
    }

    public function addStaff(UserCreateRequest $request)
    {
        if ($this->repository->hasPermission($request->user(), $request->shop_id)) {
            $permissions = [Permission::CUSTOMER, Permission::STAFF];
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'shop_id'  => $request->shop_id,
                'password' => Hash::make($request->password),
            ]);

            $user->givePermissionTo($permissions);

            return true;
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function deleteStaff(Request $request, $id)
    {
        $request->id = $id;
        return $this->removeStaff($request);
    }

    public function removeStaff(Request $request)
    {
        $id = $request->id;
        try {
            $staff = User::findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        if ($request->user()->hasPermissionTo(Permission::STORE_OWNER) || ($request->user()->hasPermissionTo(Permission::STORE_OWNER) && ($request->user()->shops->contains('id', $staff->shop_id)))) {
            $staff->delete();
            return $staff;
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function myShops(Request $request)
    {
        $user = $request->user;
        return $this->repository->where('owner_id', '=', $user->id)->get();
    }
}
