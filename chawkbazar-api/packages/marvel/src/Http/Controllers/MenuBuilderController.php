<?php

namespace Marvel\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Repositories\MenuBuilderRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\MenuBuilderRequest;

class MenuBuilderController extends CoreController
{
    public $repository;

    public function __construct(MenuBuilderRepository $repository)
    {
        $this->repository = $repository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Type[]
     */
    public function index(Request $request)
    {
        return $this->repository->all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param MenuBuilderRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(MenuBuilderRequest $request)
    {
        return $this->repository->storeMenuBuilder($request);
    }

    public function update(MenuBuilderRequest $request, $id)
    {
        $request->id = $id;
        try {
            $shop_banner = $this->repository->findOrFail($request->id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        return $this->repository->updateMenuBuilder($request, $shop_banner);
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
