<?php

namespace Marvel\Database\Repositories;

use Marvel\Database\Models\Lucky;
use Prettus\Validator\Exceptions\ValidatorException;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Criteria\RequestCriteria;

class LuckyRepository extends BaseRepository
{
    protected $dataArray = [
        'name',
        'email',
        'company',
        'phone',
        'address'
    ];

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Lucky::class;
    }

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }

    public function createLucky($request)
    {
        $MenuBuilder = $this->create($request->only($this->dataArray));
        return $MenuBuilder;
    }
}
