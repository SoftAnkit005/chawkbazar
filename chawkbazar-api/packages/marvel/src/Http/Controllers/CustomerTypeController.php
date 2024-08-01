<?php

namespace Marvel\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Repositories\CustomerTypeRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\CustomerTypeRequest;

class CustomerTypeController extends CoreController
{
    public $repository;

    public function __construct(CustomerTypeRepository $repository)
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
     * @param CustomerTypeRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(CustomerTypeRequest $request)
    {
        return $this->repository->storeCustomerType($request);
    }

    public function update(CustomerTypeRequest $request, $id)
    {
        $request->id = $id;
        try {
            $customer_type = $this->repository->findOrFail($request->id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        return $this->repository->updateCustomerType($request, $customer_type);
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
