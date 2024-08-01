<?php

namespace Marvel\Http\Controllers;

use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\Settings;
use Marvel\Database\Models\User;
use Marvel\Database\Models\Profile;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\OrderStatus;
use Marvel\Database\Repositories\OrderRepository;
use Marvel\Enums\Permission;
use Marvel\Events\OrderCreated;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\OrderCreateRequest;
use Marvel\Http\Requests\OrderUpdateRequest;
use Mail;

class OrderController extends CoreController
{
    public $repository;

    public function __construct(OrderRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Order[]
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?   $request->limit : 10;
        return $this->fetchOrders($request)->paginate($limit)->withQueryString();
    }

    public function fetchOrders(Request $request)
    {
        $user = $request->user();
        if(isset($request->customer_id) && $request->customer_id!="undefined")
        {
            return $this->repository->with('children')->where('customer_id', '=', $request->customer_id)->where('parent_id', '=', null); //->paginate($limit);
        }
        else if ($user && $user->hasPermissionTo(Permission::SUPER_ADMIN) && (!isset($request->shop_id) || $request->shop_id === 'undefined')) {
            return $this->repository->with('children')->where('id', '!=', null)->where('parent_id', '=', null); //->paginate($limit);
        } else if ($this->repository->hasPermission($user, $request->shop_id)) {
            if ($user && $user->hasPermissionTo(Permission::STORE_OWNER)) {
                return $this->repository->with('children')->where('shop_id', '=', $request->shop_id)->where('parent_id', '!=', null); //->paginate($limit);
            } elseif ($user && $user->hasPermissionTo(Permission::STAFF)) {
               return $this->repository->with('children')->where('shop_id', '=', $request->shop_id)->where('parent_id', '!=', null); //->paginate($limit);
            }
        } else if(isset($user->id)) {
            return $this->repository->with('children')->where('customer_id', '=', $user->id)->where('parent_id', '=', null); //->paginate($limit);
        }
        else{
            return $this->repository->with('children');
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param OrderCreateRequest $request
     * @return LengthAwarePaginator|\Illuminate\Support\Collection|mixed
     */
    public function store(OrderCreateRequest $request)
    {
        $order = $this->repository->storeOrder($request);
            $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEMSG&to=91'.str_replace('+91', '', $request->customer_contact).'&text=Your%20Order%20has%20been%20placed.%0AThank%20you%20for%20shopping%20with%20us.%0ABest%20Regards%2C%0ATeam%20Zweler%20-ZWELER&indiaDltContentTemplateId=1107169632673577742&indiaDltPrincipalEntityId=1101660960000072501';
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
        //     $orderUser = User::findOrFail($request->user()->id);
        // $data=["user"=>$orderUser,"order"=>$order,"products"=>$request->products];
        // $user='ansh@zweler.com';
        // Mail::send('order-placed',$data,function($messages) use ($user){
        //     $messages->to('ashudave4444@gmail.com');
        //     $messages->subject('Thank You for Your Order - Order Details Inside');
        // });
        return $order;
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        try {
            $order = $this->repository->with(['products', 'status', 'children.shop'])->findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        if ($user->hasPermissionTo(Permission::SUPER_ADMIN)) {
            return $order;
        } elseif (isset($order->shop_id)) {
            if ($this->repository->hasPermission($user, $order->shop_id)) {
                return $order;
            } elseif ($user->id == $order->customer_id) {
                return $order;
            }
        } elseif ($user->id == $order->customer_id) {
            return $order;
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }
    public function findByTrackingNumber(Request $request, $tracking_number)
    {
        $user = $request->user();
        try {
            $order = $this->repository->with(['products', 'status', 'children.shop'])->findOneByFieldOrFail('tracking_number', $tracking_number);
            if ($user->id === $order->customer_id || $user->can('super_admin')) {
                return $order;
            } else {
                throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
            }
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param OrderUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(OrderUpdateRequest $request, $id)
    {
        $request->id = $id;
        $order = $this->updateOrder($request);
        return $order;
    }


    public function updateOrder(Request $request)
    {
        try {
            $order = $this->repository->findOrFail($request->id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        $user = $request->user();
        if (isset($order->shop_id)) {
            if ($this->repository->hasPermission($user, $order->shop_id)) {
                return $this->changeOrderStatus($order, $request);
            }
        } else if ($user->hasPermissionTo(Permission::SUPER_ADMIN)) {
            return $this->changeOrderStatus($order, $request);
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function changeOrderStatus($order, $request)
    {
        $order->status = $request->status;
        $order->courier = $request->courier;
        $user = User::findOrFail($order->customer_id);
        $user_profile = Profile::Where('customer_id','=',$order->customer_id)->first();
        if(isset($order->shop_id))
        {
            $shop = Shop::findOrFail($order->shop_id);
        }
        $orderstatus = OrderStatus::findOrFail($request->status);
        $order->tracking_number = $request->tracking_number;
        if(isset($shop) && $order->status != $request->status)
        {
        $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEMSG&to=919624177111&text=Vendor%20'.str_replace(' ', '%20', $shop->name).'%2CUpdated%20status%20for%20Order%20No%3A%20'.$order->tracking_number.'%20%20to%20'.str_replace(' ', '%20', $orderstatusvendor->name).'.%20-ZWELER&indiaDltContentTemplateId=1107169632657773716&indiaDltPrincipalEntityId=1101660960000072501';
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
        if($order->status != $request->status && $request->status == 4)
        {
            $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEMSG&to=91'.str_replace('+91', '',$user_profile->contact).'&text=Hello%20'.str_replace(' ', '%20', $user->name).'%2C%0AWe%20are%20pleased%20to%20inform%20you%20that%20your%20Order%20No%3A%20ZW5489546%20has%20been%20dispatched%20through%20Blue%20'.str_replace(' ', '%20', $order->courier).'%20No%3A%20'.str_replace(' ', '%20', $order->tracking_number).'.%20%0AThank%20you%20for%20shopping%20with%20us.%0ABest%20Regards%2C%0ATeam%20Zweler%20-ZWELER&indiaDltContentTemplateId=1107169632620001035&indiaDltPrincipalEntityId=1101660960000072501';
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
        else{
            $url = 'http://api.ask4sms.in/sms/1/text/query?username=zweler&password=Zweler@321&from=ZWEMSG&to=91'.str_replace('+91', '',$user_profile->contact).'&text=Dear%20'.str_replace(' ', '%20', $user->name).'%2C%20Your%20Order%20No%3A%20ZWE1234352342%20status%20has%20been%20updated%20to%20'.str_replace(' ', '%20', $orderstatus->name).'.%0AThank%20you%20for%20shopping%20with%20us.%0ABest%20Regards%2C%0ATeam%20Zweler%20-ZWELER&indiaDltContentTemplateId=1107169632673577742&indiaDltPrincipalEntityId=1101660960000072501';
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
        $order->save();
        try {
            $children = json_decode($order->children);
        } catch (\Throwable $th) {
            $children = $order->children;
        }
        if (is_array($children) && count($children)) {
            foreach ($order->children as $child_order) {
                $child_order->status = $request->status;
                $child_order->courier = $request->courier;
                $child_order->tracking_number = $request->tracking_number;
                $child_order->save();
            }
        }
        return $order;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        try {
            return $this->repository->findOrFail($id)->delete();
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }
}
