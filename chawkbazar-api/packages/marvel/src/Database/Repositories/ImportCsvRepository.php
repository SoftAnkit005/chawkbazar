<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\ImportCsv;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class ImportCsvRepository extends BaseRepository
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
        return ImportCsv::class;
    }

    public function storeCsv($importCsvObj)
    {
        $importCsv = $this->create($importCsvObj);
        return $importCsv;
    }
    public function updateCsv($importCsvObj)
    {
        $id = $importCsvObj['id'];
        unset($importCsvObj['id']);
        $importCsv = $this->findOrFail($id)->update(['csv_link'=>$importCsvObj['csv_link'],'status'=>$importCsvObj['status']]);
        return $importCsv;
    }
}
