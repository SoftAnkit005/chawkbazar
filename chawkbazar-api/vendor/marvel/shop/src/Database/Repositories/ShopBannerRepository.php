<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\ShopBanner;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class ShopBannerRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
    ];

    protected $dataArray = [
        'title',
        'slug',
        'imageMobileUrl',
        'imageMobileWidth',
        'imageMobileHeight',
        'imageDesktopUrl',
        'imageDesktopWidth',
        'imageDesktopHeight',
        'type',
        'bannerType',
        'sequence',
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
        return ShopBanner::class;
    }

    public function storeShopBanner($request)
    {
        $ShopBanner = $this->create($request->only($this->dataArray));
        return $ShopBanner;
    }

    public function updateShopBanner($request, $ShopBanner)
    {
        $ShopBanner->update($request->only($this->dataArray));
        return $this->findOrFail($ShopBanner->id);
    }
}
