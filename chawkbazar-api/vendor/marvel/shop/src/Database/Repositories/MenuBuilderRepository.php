<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\MenuBuilder;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class MenuBuilderRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
    ];

    protected $dataArray = [
        'label',
        'path',
        'category',
        'categoryName',
        'parent',
        'parentName',
        'tag',
        'tagName',
        'type',
        'bannerSlug1',
        'bannerSlug2',
        'banners',
        'icon',
        'sequence'
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
        return MenuBuilder::class;
    }

    public function storeMenuBuilder($request)
    {
        $MenuBuilder = $this->create($request->only($this->dataArray));
        return $MenuBuilder;
    }

    public function updateMenuBuilder($request, $MenuBuilder)
    {
        $MenuBuilder->update($request->only($this->dataArray));
        return $this->findOrFail($MenuBuilder->id);
    }
}
