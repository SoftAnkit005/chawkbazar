<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\BusinessProfile;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class BusinessProfileRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
    ];

    protected $dataArray = [
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
        return BusinessProfile::class;
    }
}
