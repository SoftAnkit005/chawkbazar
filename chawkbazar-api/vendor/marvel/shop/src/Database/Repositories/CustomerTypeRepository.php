<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\CustomerType;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class CustomerTypeRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',
        'shop_id',
    ];

    protected $dataArray = [
        'name',
        'shop_id',
    ];

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }
    /**
     * Configure the Model
     **/
    public function model()
    {
        return CustomerType::class;
    }

    public function storeCustomerType($request)
    {
        $customerType = $this->create($request->only($this->dataArray));
        if (isset($request['values']) && count($request['values'])) {
            $customerType->values()->createMany($request['values']);
        }
        $customerType->values = $customerType->values;
        return $customerType;
    }

    public function updateCustomerType($request, $customer_type)
    {
        $customer_type->update($request->only($this->dataArray));
        return $this->findOrFail($customer_type->id);
    }
}
