<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\ImportCsvLog;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class ImportCsvLogRepository extends BaseRepository
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
        return ImportCsvLog::class;
    }

    public function storeCsv($importCsvObj)
    {
        $importCsv = $this->create($importCsvObj);
        return $importCsv;
    }
}
