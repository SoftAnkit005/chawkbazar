<?php

namespace Marvel\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Repositories\AttributeRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\AttributeRequest;
use Marvel\Database\Models\AttributeValue;
use Marvel\Database\Models\AttributeValueLog;

class AttributeController extends CoreController
{
    public $repository;

    public function __construct(AttributeRepository $repository)
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
        return $this->repository->with(['values'])->all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AttributeRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(AttributeRequest $request)
    {
        return $this->repository->storeAttribute($request);
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
            return $this->repository->with('values')->findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AttributeRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(AttributeRequest $request, $id)
    {
        $request->id = $id;
        return $this->updateAttribute($request);
    }

    public function updateAttribute(AttributeRequest $request)
    {

            try {
                $attribute = $this->repository->with('values')->findOrFail($request->id);
            } catch (\Exception $e) {
                throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
            }
            return $this->repository->updateAttribute($request, $attribute);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $request->id = $id;
        return $this->deleteAttribute($request);
    }

    public function deleteAttribute(Request $request)
    {
        try {
            $attribute = $this->repository->findOrFail($request->id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
            $attribute->delete();
            return $attribute;
    }

    public function downloadSolitaireSampleFile(Request $request)
    {
        // $path = storage_path() . '/app/public/csv-files/SOLITAIRE_SAMPLE_ATTRIBUTES.csv';
        // echo '<pre>';
        // print_r($path);
        // echo '</pre>';
        // die;
        return response()->download(storage_path() . '/app/public/csv-files/SOLITAIRE_SAMPLE_ATTRIBUTES.csv');
    }

    public function exportAttributes(Request $request)
    {
        $filename = 'attributes.csv';
        $headers = [
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=' . $filename,
            'Expires'             => '0',
            'Pragma'              => 'public'
        ];

        $list = $this->repository->with(['values'])->get()->toArray();
        if (!count($list)) {
            return response()->stream(function () {
            }, 200, $headers);
        }
        # add headers for each column in the CSV download
        array_unshift($list, array_keys($list[0]));

        $callback = function () use ($list) {
            $FH = fopen('php://output', 'w');
            $counter = 0;
            $putCsvHeader = array(
                "name" => 'name',
                "value" => "value",
                "B2C" => "B2C",
                "B2B" => "B2B",
                "B2S" => "B2S",
            );
            fputcsv($FH, $putCsvHeader);
            foreach ($list as $key => $row) {
                if ($key === 0) {
                    $exclude = ['id', 'shop_id', 'created_at', 'updated_at', 'slug'];
                    $row = array_diff($row, $exclude);
                }
                unset($row['id']);
                unset($row['shop_id']);
                unset($row['updated_at']);
                unset($row['slug']);
                unset($row['created_at']);
                if (isset($row['values'])) {
                    $valString = '';
                    $putCsv = array(
                        "name" => $row['name'],
                        "value" => "",
                        "B2C" => "",
                        "B2B" => "",
                        "B2S" => "",
                    );
                    foreach($row['values'] as $val)
                    {
                        $counter++;                
                        if(!str_contains($valString,$val['value']))
                        {
                            if($valString == '')
                            {
                                $valString = $val['value'];   
                            }
                            else{
                                $valString = $valString.','.$val['value'];
                            }
                        }
                    if($counter%3 == 1)
                    { 
                    $putCsv["value"] = $val['value'];
                    $putCsv["B2C"] = $val['rate'];
                    }
                    if($counter%3 == 2)
                    { 
                    $putCsv["B2B"] = $val['rate'];
                    }
                    if($counter%3 == 0)
                    { 
                    $putCsv["B2S"] = $val['rate'];
                    fputcsv($FH, $putCsv);   
                    }


                }
                    $row['values'] = $valString;
                }
                
            }
            fclose($FH);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importAttributes(Request $request)
    {
        $requestFile = $request->file();
        $user = $request->user();

        if (count($requestFile)) {
            if (isset($requestFile['csv'])) {
                $uploadedCsv = $requestFile['csv'];
            } else {
                $uploadedCsv = current($requestFile);
            }
        }

            $file = $uploadedCsv->storePubliclyAs('csv-files', 'attributes.' . $uploadedCsv->getClientOriginalExtension(), 'public');

            $attributes = $this->repository->csvToArray(str_replace("/storage","/public/storage",storage_path()) . '/'. $file);
            foreach ($attributes as $key => $attribute) {
                if (!isset($attribute['name']) || !isset($attribute['value']) || !isset($attribute['B2C']) || !isset($attribute['B2B']) || !isset($attribute['B2S'])) {
                    throw new MarvelException("MARVEL_ERROR.WRONG_CSV");
                }
                unset($attribute['id']);
                unset($attribute['shop_id']);
                $createAttribute = $attribute;
                unset($createAttribute['value']);
                unset($createAttribute['B2C']);
                unset($createAttribute['B2B']);
                unset($createAttribute['B2S']);
                $newAttribute = $this->repository->firstOrCreate($createAttribute);
                $val1 = $newAttribute->values()->firstOrCreate(['vendor_Type' => 1, 'value' => $attribute['value']]);
                $val1FindUpdate = AttributeValue::find($val1['id']);
                $val1FindUpdate->rate = $attribute['B2C'];
                $val1FindUpdate->save();
                $val1['attribute_id'] = $val1FindUpdate['id'];
                $val2 = $newAttribute->values()->firstOrCreate(['vendor_Type' => 2, 'value' => $attribute['value']]);
                $val2FindUpdate = AttributeValue::find($val2['id']);
                $val2FindUpdate->rate = $attribute['B2B'];
                $val2FindUpdate->save();
                $val2['attribute_id'] = $val2FindUpdate['id'];
                $val3 = $newAttribute->values()->firstOrCreate(['vendor_Type' => 3, 'value' => $attribute['value']]);
                $val3FindUpdate = AttributeValue::find($val3['id']);
                $val3FindUpdate->rate = $attribute['B2S'];
                $val3FindUpdate->save();
                $val3['attribute_id'] = $val3FindUpdate['id'];
            }
            return true;
    }
}
