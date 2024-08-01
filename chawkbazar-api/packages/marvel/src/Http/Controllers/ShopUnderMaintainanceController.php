<?php

namespace Marvel\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Repositories\ShopUnderMaintainanceRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\ShopUnderMaintainanceRequest;

class ShopUnderMaintainanceController extends CoreController
{
    public $repository;

    public function __construct(ShopUnderMaintainanceRepository $repository)
    {
        $this->repository = $repository;
    }

    public function update(ShopUnderMaintainanceRequest $request, $id)
    {
        $request->id = $id;
        try {
            $shop_under_maintainance = $this->repository->findOrFail($request->id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        return $this->repository->updateShopUnderMaintainance($request, $shop_under_maintainance);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id)
    {
        try {
            return $this->repository->findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }
}
