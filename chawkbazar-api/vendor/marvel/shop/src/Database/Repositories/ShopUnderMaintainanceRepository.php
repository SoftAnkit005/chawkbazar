<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\ShopUnderMaintainance;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class ShopUnderMaintainanceRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
    ];

    protected $dataArray = [
        'type',
        'value',
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
        return ShopUnderMaintainance::class;
    }

    public function updateShopUnderMaintainance($request, $ShopUnderMaintainance)
    {
        $ShopUnderMaintainance->update($request->only($this->dataArray));
        return $this->findOrFail($ShopUnderMaintainance->id);
    }
}
