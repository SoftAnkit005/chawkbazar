<?php

namespace Marvel\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Marvel\Database\Models\Attribute;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\AttributeValue;
use Marvel\Database\Repositories\ProductRepository;
use Marvel\Database\Repositories\ImportCsvRepository;
use Marvel\Database\Repositories\ImportCsvLogRepository;
use Marvel\Database\Models\Product;
use Marvel\Database\Models\Type;
use Marvel\Database\Models\VariationOption;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\ProductCreateRequest;
use Marvel\Http\Requests\ProductUpdateRequest;

class ProductController extends CoreController
{
    public $repository;

    public function __construct(ProductRepository $repository, ImportCsvRepository $importCsvRepository, ImportCsvLogRepository $importCsvLogRepository)
    {
        $this->repository = $repository;
        $this->importCsvRepository = $importCsvRepository;
        $this->importCsvLogRepository = $importCsvLogRepository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Product[]
     */

    public function index(Request $request)
    {

        $limit = $request->limit ?   $request->limit : 15;
        if(substr($request->search, 0, 2) === "id")
        {
            return $this->repository->withCount('orders')->with(['type', 'shop', 'categories', 'tags', 'variations.attribute','variation_options'])->whereIn("id",explode(",",str_replace("id:","",$request->search)))->paginate($limit);
        }
        $returnList = $this->repository->withCount('orders')->with(['type', 'shop', 'categories', 'tags', 'variations.attribute','shop.balance'])->paginate($limit);
        if(substr($request->search, 0, 4) === "name")
        {
            $returnList = $this->repository->withCount('orders')->with(['type', 'shop', 'categories', 'tags', 'variations.attribute'])->orWhere("stylecode","like","%".explode(";",str_replace("name:","",$request->search))[0]."%")->paginate($limit);
        }
        return $returnList;
    }

    public function nonsolitaireindex(Request $request)
    {
        $limit = $request->limit ?   $request->limit : 15;
        $returnList = $this->repository->whereNotIn("type_id",[6])->withCount('orders')->with(['type', 'shop', 'categories', 'tags', 'variations.attribute'])->paginate($limit);
        if(substr($request->search, 0, 4) === "name")
        {
            $styleCode = explode(";",str_replace("name:","",$request->search))[0];
            $request->search = '';
            $returnList = $this->repository->orWhere("stylecode","like","%".$styleCode."%")->whereNotIn("type_id",[6])->withCount('orders')->with(['type', 'shop', 'categories', 'tags', 'variations.attribute'])->paginate($limit);
        }
        return $returnList;
    }

    public function solitaireindex(Request $request)
    {
        $limit = $request->limit ?   $request->limit : 15;
        $returnList = $this->repository->whereIn("type_id",[6])->withCount('orders')->with(['type', 'shop', 'categories', 'tags', 'variations.attribute'])->paginate($limit);
        if(substr($request->search, 0, 4) === "name")
        {
            $styleCode = explode(";",str_replace("name:","",$request->search))[0];
            $request->search = '';
            $returnList = $this->repository->orWhere("stylecode","like","%".$styleCode."%")->whereIn('type_id',[6])->withCount('orders')->with(['type', 'shop', 'categories', 'tags', 'variations.attribute'])->paginate($limit);
        }
        return $returnList;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param ProductCreateRequest $request
     * @return mixed
     */
    public function store(ProductCreateRequest $request)
    {
        if ($this->repository->hasPermission($request->user(), $request->shop_id)) {
            return $this->repository->storeProduct($request);
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function deleteSolitaireProducts(Request $request)
    {
        $requestFile = $request->file();
        $user = $request->user();
        $shop_id = $request->shop_id;
        $shop = Shop::findOrFail($shop_id);
        $shop_name = $shop->name;
        $type = Type::findOrFail(6);
        $type_name = $type->name;
        if (count($requestFile)) {
            if (isset($requestFile['csv'])) {
                $uploadedCsv = $requestFile['csv'];
            } else {
                $uploadedCsv = current($requestFile);
            }
        }
        if (!$this->repository->hasPermission($user, $shop_id)) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
        if (isset($shop_id)) {
            $file = $uploadedCsv->storePubliclyAs('csv-files', 'delete-solitaire-products-' . $shop_id . '.' . $uploadedCsv->getClientOriginalExtension(), 'public');
            $fileLog = $uploadedCsv->storePubliclyAs('csv-files-log', 'delete-solitaire-products-' . $shop_id .date(DATE_ATOM).'.'. $uploadedCsv->getClientOriginalExtension(), 'public');
            $products = $this->repository->csvToArray(str_replace("/storage","/public/storage",storage_path()) . '/' . $file);
            if(count($products)>2000){
                throw new MarvelException("CAN'T IMPORT MORE THAN 2000 PRODUCTS AT A TIME");
            }
            $i=0;
            $stoneids = array();
            $j=0;
            foreach ($products as $key => $product) {
                if (!isset($product['STONEID_OR_STYLECODE'])) {
                    throw new MarvelException("STONEID_OR_STYLECODE FIELD IS MISSING");
                }
                if(in_array($product['STONEID_OR_STYLECODE'],$stoneids))
                {
                    throw new MarvelException("DUPLICATE STONEID_OR_STYLECODE AT LINE ".($j+1));
                }
                array_push($stoneids,$product['STONEID_OR_STYLECODE']);
                $j++;
            }
            $random = substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10/strlen($x)) )),1,10);
            $this->repository->whereIn('stylecode',$stoneids)->where('shop_id', $shop_id)->where('type_id',6)->where('product_type','simple')->where('deleted_at',null)->update(['stylecode'=>$random,'sku'=>$random]);
            $this->repository->whereIn('stylecode',$stoneids)->where('shop_id', $shop_id)->where('type_id',6)->where('product_type','simple')->where('deleted_at',null)->delete();
            return true;
        }
        return false;
    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return JsonResponse
     */
    public function show($slug, Request $request)
    {
        try {
            $limit = isset($request->limit) ? $request->limit : 10;
            $product = $this->repository
                ->with(['type', 'shop', 'categories', 'tags', 'variations.attribute.values', 'variation_options'])
                ->findOneByFieldOrFail('slug', $slug);
            $product->related_products = $this->repository->fetchRelated($slug, $limit);
            return $product;
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ProductUpdateRequest $request
     * @param int $id
     * @return array
     */
    public function update(ProductUpdateRequest $request, $id)
    {
        // $request->id = $id;
        // echo '<pre>';
        // print_r($request->all());
        // echo '</pre>';
        // die;
        // return $this->updateProduct($request);
         if ($this->repository->hasPermission($request->user(), $request->shop_id)) {
            return $this->repository->updateProduct($request,$id);
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function updateProduct(Request $request)
    {
        if ($this->repository->hasPermission($request->user(), $request->shop_id)) {
            $id = $request->id;
            return $this->repository->updateProduct($request, $id);
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function multiplepublish(Request $request)
    {
        if ($request->product_id) {
            $product_ids = explode(',', $request->product_id);

            foreach ($product_ids as $product_id) {
                $product = Product::where('id', $product_id)->first();

                if(empty($product)) {
                    return response()->json(['message' => 'Products Not Found']);
                }else
                {
                    $product->status = 'publish';
                    $product->save();
                }
            }
            return response()->json(['message' => 'Products published successfully']);
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        try {
            $random = substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10/strlen($x)) )),1,10);
            $this->repository->findOrFail($id)->update(['stylecode'=>$random,'sku'=>$random]);
            return $this->repository->findOrFail($id)->delete();
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    public function relatedProducts(Request $request)
    {
        $limit = isset($request->limit) ? $request->limit : 10;
        $slug =  $request->slug;
        return $this->repository->fetchRelated($slug, $limit);
    }

    public function exportProducts(Request $request, $shop_id)
    {
        $filename = 'products-for-shop-id-' . $shop_id . '.csv';
        $headers = [
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=' . $filename,
            'Expires'             => '0',
            'Pragma'              => 'public'
        ];

        $list = $this->repository->where('shop_id', $shop_id)->get()->toArray();
        if (!count($list)) {
            return response()->stream(function () {
            }, 200, $headers);
        }
        # add headers for each column in the CSV download
        array_unshift($list, array_keys($list[0]));

        $callback = function () use ($list) {
            $FH = fopen('php://output', 'w');
            foreach ($list as $key => $row) {
                if ($key === 0) {
                    $exclude = ['id', 'slug', 'deleted_at', 'created_at', 'updated_at', 'shipping_class_id'];
                    $row = array_diff($row, $exclude);
                }
                unset($row['id']);
                unset($row['deleted_at']);
                unset($row['shipping_class_id']);
                unset($row['updated_at']);
                unset($row['created_at']);
                unset($row['slug']);
                if (isset($row['image'])) {
                    $row['image'] = json_encode($row['image']);
                }
                if (isset($row['gallery'])) {
                    $row['gallery'] = json_encode($row['gallery']);
                }
                fputcsv($FH, $row);
            }
            fclose($FH);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportVariableOptions(Request $request, $shop_id)
    {

        $filename = 'variable-options-' . Str::random(5) . '.csv';
        $headers = [
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=' . $filename,
            'Expires'             => '0',
            'Pragma'              => 'public'
        ];

        $products = $this->repository->where('shop_id', $shop_id)->get();

        $list = VariationOption::WhereIn('product_id', $products->pluck('id'))->get()->toArray();

        if (!count($list)) {
            return response()->stream(function () {
            }, 200, $headers);
        }
        # add headers for each column in the CSV download
        array_unshift($list, array_keys($list[0]));

        $callback = function () use ($list) {
            $FH = fopen('php://output', 'w');
            foreach ($list as $key => $row) {
                if ($key === 0) {
                    $exclude = ['id', 'created_at', 'updated_at'];
                    $row = array_diff($row, $exclude);
                }
                unset($row['id']);
                unset($row['updated_at']);
                unset($row['created_at']);
                if (isset($row['options'])) {
                    $row['options'] = json_encode($row['options']);
                }
                fputcsv($FH, $row);
            }
            fclose($FH);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importProducts(Request $request)
    {
        $requestFile = $request->file();
        $user = $request->user();
        $shop_id = $request->shop_id;

        if (count($requestFile)) {
            if (isset($requestFile['csv'])) {
                $uploadedCsv = $requestFile['csv'];
            } else {
                $uploadedCsv = current($requestFile);
            }
        }

        if (!$this->repository->hasPermission($user, $shop_id)) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
        if (isset($shop_id)) {
            $file = $uploadedCsv->storePubliclyAs('csv-files', 'products-' . $shop_id . '.' . $uploadedCsv->getClientOriginalExtension(), 'public');

            $products = $this->repository->csvToArray(storage_path() . '/app/public/' . $file);

            foreach ($products as $key => $product) {
                if (!isset($product['type_id'])) {
                    throw new MarvelException("MARVEL_ERROR.WRONG_CSV");
                }
                unset($product['id']);
                $product['shop_id'] = $shop_id;
                $product['image'] = json_decode($product['image'], true);
                $product['gallery'] = json_decode($product['gallery'], true);
                try {
                    $type = Type::findOrFail($product['type_id']);
                    if (isset($type->id)) {
                        Product::firstOrCreate($product);
                    }
                } catch (Exception $e) {
                }
            }
            return true;
        }
    }

    public function importSolitaireProducts(Request $request)
    {
        $requestFile = $request->file();
        $user = $request->user();
        $shop_id = $request->shop_id;
        $shop = Shop::findOrFail($shop_id);
        $shop_name = $shop->name;
        $type = Type::findOrFail(6);
        $type_name = $type->name;
        if (count($requestFile)) {
            if (isset($requestFile['csv'])) {
                $uploadedCsv = $requestFile['csv'];
            } else {
                $uploadedCsv = current($requestFile);
            }
        }
        if (!$this->repository->hasPermission($user, $shop_id)) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
        if (isset($shop_id)) {
            $file = $uploadedCsv->storePubliclyAs('csv-files', 'solitaire-products-' . $shop_id . '.' . $uploadedCsv->getClientOriginalExtension(), 'public');
            // $fileLog = $uploadedCsv->storePubliclyAs('csv-files-log', 'solitaire-products-' . $shop_id .date('Y-m-d').'.'. $uploadedCsv->getClientOriginalExtension(), 'public');
            // // $products = $this->repository->csvToArray(str_replace("/storage","/public/storage",storage_path()) . '/' . $file);

            //  $filePath = public_path('storage/csv-files/' . basename($file));
            // echo '<pre>';
            // print_r($filePath);
            // echo '</pre>';
            // die;

            $fileLog = $uploadedCsv->storePubliclyAs('csv-files-log', 'solitaire-products-' . $shop_id .date(DATE_ATOM).'.'. $uploadedCsv->getClientOriginalExtension(), 'public');

            $products = $this->repository->csvToArray(str_replace("/storage","/public/storage",storage_path()) . '/' . $file);

            // Convert CSV to array
            // $products = $this->repository->csvToArray($filePath);
            if(count($products)>2000){
                throw new MarvelException("CAN'T IMPORT MORE THAN 2000 PRODUCTS AT A TIME");
            }
            $i=0;
            $stoneids = array();
            $j=0;
            foreach ($products as $key => $product) {
                if(in_array($product['STONEID_OR_STYLECODE'],$stoneids))
                {
                    throw new MarvelException("DUPLICATE STONEID_OR_STYLECODE AT LINE ".($j+1));
                }
                array_push($stoneids,$product['STONEID_OR_STYLECODE']);
                $j++;
            }
            foreach ($products as $key => $product) {

            if (!isset($product['STONEID_OR_STYLECODE']) || !isset($product['SHAPE']) || !isset($product['WEIGHT']) || !isset($product['COLOR']) || !isset($product['CLARITY']) || !isset($product['CUT']) || !isset($product['POLISH']) || !isset($product['SYMMETRY']) || !isset($product['FLUORESCENCE']) || !isset($product['GRADING']) || !isset($product['LOCATION']) || !isset($product['IMAGELINK']) || !isset($product['VIDEOLINK']) || !isset($product['CERTIFICATELINK']) || !isset($product['CERT_NO']) || !isset($product['DISCOUNT%']) || !isset($product['RATE_PER_CT'])) {
                throw new MarvelException("SOME FIELDS ARE MISSING");
            }

            if($product['NAME']=="" || $product['STONEID_OR_STYLECODE']=="" || $product['SHAPE']=="" || trim($product['WEIGHT'])=="" || $product['COLOR']=="" || $product['CLARITY']=="" || $product['CUT']=="" || $product['POLISH']=="" || $product['SYMMETRY']=="" || $product['FLUORESCENCE']=="" || $product['GRADING']=="" || $product['LOCATION']=="" || trim($product['DISCOUNT%'])=="" || trim($product['RATE_PER_CT'])=="" )
            {

                throw new MarvelException("REQUIRED FIELDS CAN'T BE EMPTY AT LINE ".$i+1);
            }
            if(!in_array($product['SHAPE'],array("ROUND","PEAR","OVAL","MARQUISE","HEART","RADIANT","PRINCESS","EMERALD","ASSCHER","SQ.EMERALD","ASSCHER & SQ.EMELARD","SQUARE RADIANT","CUSHION","BAGUETTE","EUROPEAN CUT")))
            {
                throw new MarvelException("INVALID SHAPE AT LINE ".$i+1);
            }
            $sizeInt = (float)trim($product['WEIGHT']);
            if($sizeInt*100<1 || $sizeInt*100>1000)
            {
                throw new MarvelException("INVALID WEIGHT AT LINE ".$i+1);
            }
            if(str_contains(trim($product['DISCOUNT%']),'%'))
            {
                throw new MarvelException("INVALID DISCOUNT AT LINE ".$i+1);
            }
            $discountInt = (float)trim($product['DISCOUNT%']);
            if($discountInt<-100 || $discountInt>100)
            {
                throw new MarvelException("INVALID DISCOUNT AT LINE ".$i+1);
            }
            if(!in_array($product['COLOR'],array("D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z")))
            {
                throw new MarvelException("INVALID COLOR AT LINE ".$i+1);
            }
            if(!in_array($product['CLARITY'],array("SI1","SI2","SI3","VS1","VS2","VVS1","VVS2","IF","FL","I1","I2","I3")))
            {
                throw new MarvelException("INVALID CLARITY AT LINE ".$i+1);
            }
            if(!in_array($product['CUT'],array("ANY","IDEAL","EXCELLENT","VERY GOOD","GOOD","FAIR","POOR","A","ID","EX","VG","G","F","P")))
            {
                throw new MarvelException("INVALID CUT AT LINE ".$i+1);
            }
            if(!in_array($product['POLISH'],array("ANY","IDEAL","EXCELLENT","VERY GOOD","GOOD","FAIR","POOR","A","ID","EX","VG","G","F","P")))
            {
                throw new MarvelException("INVALID POLISH AT LINE ".$i+1);
            }
            if(!in_array($product['SYMMETRY'],array("ANY","IDEAL","EXCELLENT","VERY GOOD","GOOD","FAIR","POOR","A","ID","EX","VG","G","F","P")))
            {
                throw new MarvelException("INVALID SYMMETRY AT LINE ".$i+1);
            }
            if(!in_array($product['FLUORESCENCE'],array("NONE","VERY SLIGHT","FAINT/SLIGHT","FAINT","SLIGHT","MEDIUM","STRONG","VERY STRONG","N","VS","F","S","M","ST","VST")))
            {
                throw new MarvelException("INVALID FLUORESCENCE AT LINE ".$i+1);
            }
            if(!in_array($product['GRADING'],array("GIA","AGS","DBIOD","DHI","HRD","NGTC","GIA DOR","CGL","GCAL","GSI","IGI")))
            {
                throw new MarvelException("INVALID GRADING AT LINE ".$i+1);
            }
            if(!in_array($product['LOCATION'],array("INDIA","USA","NEW YORK","LOS ANGELES","HONG KONG","BELGIUM","ISRAEL","CHINA","EUROPE","JAPAN","UNITED KINGDOM","AUSTRALIA")))
            {
                throw new MarvelException("INVALID LOCATION AT LINE ".$i+1);
            }
            $i++;
        }
        $sheet_type = $request->sheet_type;
        $existingImportedCsv = $this->importCsvRepository->all()->whereIn('type_id',6)->whereIn('shop_id',$shop_id)->first();
        if($existingImportedCsv)
        {

            $updateImportCsvObj = [
                'id'=>$existingImportedCsv->id,
                'csv_link'=>$file,
                'status'=>'waiting'
            ];
            $imported = $this->importCsvRepository->updateCsv($updateImportCsvObj);
            $importCsvObjLog = [
                'shop_id'=>$shop_id,
                'csv_link'=>$fileLog,
                'shop_name'=>$shop_name,
                'type_id'=>6,
                'sheet_type_id'=>$sheet_type,
                'type_name'=>$type_name
            ];
            $importedLog = $this->importCsvLogRepository->storeCsv($importCsvObjLog);
        }
        else
        {
            $importCsvObj = [
                'shop_id'=>$shop_id,
                'csv_link'=>$file,
                'shop_name'=>$shop_name,
                'type_id'=>6,
                'sheet_type'=>$sheet_type,
                'type_name'=>$type_name
            ];
            $imported = $this->importCsvRepository->storeCsv($importCsvObj);
            $importCsvObjLog = [
                'shop_id'=>$shop_id,
                'csv_link'=>$fileLog,
                'shop_name'=>$shop_name,
                'type_id'=>6,
                'sheet_type_id'=>$sheet_type,
                'type_name'=>$type_name
            ];
            $importedLog = $this->importCsvLogRepository->storeCsv($importCsvObjLog);
        }
        return $imported;
        //return $products;
                // foreach ($products as $key => $product) {
                //     if (!isset($product['type_id'])) {
                //         throw new MarvelException("MARVEL_ERROR.WRONG_CSV");
                //     }
                //     unset($product['id']);
                //     $product['shop_id'] = $shop_id;
                //     $product['image'] = json_decode($product['image'], true);
                //     $product['gallery'] = json_decode($product['gallery'], true);
                //     try {
                //         $type = Type::findOrFail($product['type_id']);
                //         if (isset($type->id)) {
                //             Product::firstOrCreate($product);
                //         }
                //     } catch (Exception $e) {
                //     }
                // }
    //            return true;
        }
    }

    public function importedCsvs(Request $request)
    {
        $limit = $request->limit ?   $request->limit : 10;
        $importCsvs = $this->importCsvRepository->paginate($limit);
        return $importCsvs;
    }

    public function importSolitaireCsv(Request $request)
    {
        $shop = Shop::findOrFail($request->shop_id);
        $import_csv = $this->importCsvRepository->findOrFail($request->id);

        $products = $this->repository->csvToArray(str_replace("/storage","/public/storage",storage_path()).'/'.$import_csv->csv_link);
        // $file = $import_csv->csv_link;
        // $filePath = public_path('storage/csv-files/' . basename($file));

        // $products = $this->repository->csvToArray($filePath);
        $product_chunks = array_chunk($products,250);
        $existing_solitaire_products = $this->repository->all()->where('shop_id',$request->shop_id)->where('type_id',6);
    //     $arrExistsMain = [];
    //     $arrExists = [];
    //     foreach ($existing_solitaire_products->toArray() as $key => $row) {
    //         array_push($arrExistsMain,$row['stylecode']);
    //     }
    //     foreach($product_chunks as $key=> $products)
    //     {
    //     foreach($products as $key=> $row2){
    //         foreach ($existing_solitaire_products->toArray() as $key => $row) {
    //             if('SH'.$request->shop_id.'-'.$row2['STONEID_OR_STYLECODE']==$row['stylecode'] || $row2['STONEID_OR_STYLECODE']==$row['stylecode'])
    //             {
    //                 array_push($arrExists,$row['stylecode']);
    //             }
    //         }
    //     }
    // }
    //     $arrExists = array_unique($arrExists);
    //     $arrDiff = array_diff($arrExistsMain,$arrExists);
    //     foreach($arrDiff as $key => $rowToDisable)
    //     {
    //         $already_exists = $existing_solitaire_products->where('stylecode',$rowToDisable)->first();
    //         $update_obj = [
    //             'status' => 'draft'
    //         ];
    //         $already_exists->update($update_obj);
    //     }
        foreach($product_chunks as $key=> $products)
        {
            foreach ($products as $key => $row) {


                if (isset($row['TYPE'])) {

                    $type_name = $row['TYPE'];
                }else
                {
                    $type_name = 'Natural';
                }

                $already_exists = $existing_solitaire_products->where('stylecode','SH'.$request->shop_id.'-'.$row['STONEID_OR_STYLECODE'])->first();
                if($row['CUT'] == "A")
                {
                    $row['CUT'] = "ANY";
                }
                if($row['CUT'] == "ID")
                {
                    $row['CUT'] = "IDEAL";
                }
                if($row['CUT'] == "EX")
                {
                    $row['CUT'] = "EXCELLENT";
                }
                if($row['CUT'] == "VG")
                {
                    $row['CUT'] = "VERY GOOD";
                }
                if($row['CUT'] == "G")
                {
                    $row['CUT'] = "GOOD";
                }
                if($row['CUT'] == "F")
                {
                    $row['CUT'] = "FAIR";
                }
                if($row['CUT'] == "P")
                {
                    $row['CUT'] = "POOR";
                }
                if($row['POLISH'] == "A")
                {
                    $row['POLISH'] = "ANY";
                }
                if($row['POLISH'] == "ID")
                {
                    $row['POLISH'] = "IDEAL";
                }
                if($row['POLISH'] == "EX")
                {
                    $row['POLISH'] = "EXCELLENT";
                }
                if($row['POLISH'] == "VG")
                {
                    $row['POLISH'] = "VERY GOOD";
                }
                if($row['POLISH'] == "G")
                {
                    $row['POLISH'] = "GOOD";
                }
                if($row['POLISH'] == "F")
                {
                    $row['POLISH'] = "FAIR";
                }
                if($row['POLISH'] == "P")
                {
                    $row['POLISH'] = "POOR";
                }
                if($row['SYMMETRY'] == "A")
                {
                    $row['SYMMETRY'] = "ANY";
                }
                if($row['SYMMETRY'] == "ID")
                {
                    $row['SYMMETRY'] = "IDEAL";
                }
                if($row['SYMMETRY'] == "EX")
                {
                    $row['SYMMETRY'] = "EXCELLENT";
                }
                if($row['SYMMETRY'] == "VG")
                {
                    $row['SYMMETRY'] = "VERY GOOD";
                }
                if($row['SYMMETRY'] == "G")
                {
                    $row['SYMMETRY'] = "GOOD";
                }
                if($row['SYMMETRY'] == "F")
                {
                    $row['SYMMETRY'] = "FAIR";
                }
                if($row['SYMMETRY'] == "P")
                {
                    $row['SYMMETRY'] = "POOR";
                }
                if($row['FLUORESCENCE'] == "N")
                {
                    $row['FLUORESCENCE'] = "NONE";
                }
                if($row['FLUORESCENCE'] == "VS")
                {
                    $row['FLUORESCENCE'] = "VERY SLIGHT";
                }
                if($row['FLUORESCENCE'] == "FS")
                {
                    $row['FLUORESCENCE'] = "FAINT/SLIGHT";
                }
                if($row['FLUORESCENCE'] == "F")
                {
                    $row['FLUORESCENCE'] = "FAINT";
                }
                if($row['FLUORESCENCE'] == "S")
                {
                    $row['FLUORESCENCE'] = "SLIGHT";
                }
                if($row['FLUORESCENCE'] == "M")
                {
                    $row['FLUORESCENCE'] = "MEDIUM";
                }
                if($row['FLUORESCENCE'] == "ST")
                {
                    $row['FLUORESCENCE'] = "STRONG";
                }
                if($row['FLUORESCENCE'] == "VST")
                {
                    $row['FLUORESCENCE'] = "VERY STRONG";
                }
                if(!isset($already_exists))
                {
                    $row['name'] = $row['NAME'];
                    $row['cert_no'] = $row['CERT_NO'];
                    // $row['description'] = $row['DESCRIPTION'];
                    $row['type_name'] = $type_name;
                    $row['stylecode'] = 'SH'.$request->shop_id.'-'.$row['STONEID_OR_STYLECODE'];
                    $row['sku'] = $row['stylecode'];
                    unset($row['STONEID_OR_STYLECODE']);
                    $row['type_id'] = 6;
                    $row['size'] = trim($row['WEIGHT']);
                    $row['rate_per_unit'] = trim($row['RATE_PER_CT']);
                    $row['discount'] = abs(trim($row['DISCOUNT%']));
                    $row['rate_per_unit_before_commission'] = $row['rate_per_unit'];
                    //$row['price'] = ($row['rate_per_unit'] + ($row['rate_per_unit']*($row['discount']/100))) * $row['size'];
                    // $derived_rpu = $row['rate_per_unit'] / (1+($row['discount']/100));
                    if(isset($shop->balance->admin_commission_rate_solitaire) && $shop->balance->admin_commission_rate_solitaire > 0)
                    {
                        $row['commission'] = $shop->balance->admin_commission_rate_solitaire;
                        $discountAfterCommission = $row['discount'] - $shop->balance->admin_commission_rate_solitaire;
                        $row['customer_discount'] = $row['discount'] - $shop->balance->admin_commission_rate_solitaire_customer;
                        // $row['rate_per_unit'] = $derived_rpu - ($derived_rpu - ($derived_rpu*(1+($discountAfterCommission/100))));
                        // $row['rate_per_unit'] = ($row['RAPRATE'] * $discountAfterCommission) / 100;
                        $discount_price_customer = ($row['RAPRATE'] * $row['customer_discount']) / 100;
                        $row['rate_per_unit_customer'] = $row['RAPRATE'] - $discount_price_customer;
                        $discount_price = ($row['RAPRATE'] * $discountAfterCommission) / 100;
                        $row['rate_per_unit'] = $row['RAPRATE'] - $discount_price;
                        $row['discount'] = $discountAfterCommission;
                    }
                    else
                    {
                        $row['commission'] = 0;
                        $discountAfterCommission = $row['discount'];
                        // $row['rate_per_unit'] = $derived_rpu - ($derived_rpu - ($derived_rpu*(1+($discountAfterCommission/100))));
                        $row['rate_per_unit'] = $row['RATE_PER_CT'];
                        $row['rate_per_unit_customer'] = $row['RATE_PER_CT'];
                        $row['discount'] = $discountAfterCommission;
                    }
                    $row['price'] = $row['rate_per_unit'] * $row['size'];
                    $row['max_price'] = $row['price'];
                    $row['min_price'] = $row['price'];
                    $row['sale_price'] = (float)$row['price']-1;
                    $row['shop_id'] = $request->shop_id;
                    $row['quantity'] = 1;
                    $row['in_stock'] = 1;
                    $row['is_taxable'] = 0;
                    $row['status'] = 'publish';
                    $row['product_type'] = 'simple';
                    $row['image_link'] = $row['IMAGELINK'];
                    $row['video_link'] = $row['VIDEOLINK'];
                    $row['certificate_link'] = $row['CERTIFICATELINK'];
                    $row['shape'] = $row['SHAPE'];
                    $row['color'] = $row['COLOR'];
                    $row['buy_back_policy'] = $shop['buy_back_policy'];
                    $row['clarity'] = $row['CLARITY'];
                    $row['cut'] = $row['CUT'];
                    $row['polish'] = $row['POLISH'];
                    $row['symmetry'] = $row['SYMMETRY'];
                    $row['fluorescence'] = $row['FLUORESCENCE'];
                    $row['rap_rate'] = $row['RAPRATE'];
                    $row['amount'] = $row['AMOUNT'];
                    $row['grading'] = $row['GRADING'];
                    $row['location'] = $row['LOCATION'];
                    unset($row['NAME']);
                    unset($row['CERT_NO']);
                    // unset($row['DESCRIPTION']);
                    unset($row['TYPE']);
                    unset($row['SHAPE']);
                    unset($row['WEIGHT']);
                    unset($row['COLOR']);
                    unset($row['CLARITY']);
                    unset($row['CUT']);
                    unset($row['POLISH']);
                    unset($row['SYMMETRY']);
                    unset($row['FLUORESCENCE']);
                    unset($row['RAPRATE']);
                    unset($row['AMOUNT']);
                    unset($row['GRADING']);
                    unset($row['LOCATION']);
                    unset($row['IMAGELINK']);
                    unset($row['VIDEOLINK']);
                    unset($row['CERTIFICATELINK']);
                    unset($row['DISCOUNT%']);
                    unset($row['RATE_PER_CT']);
                    $createdProduct = $this->repository->create($row);
                    $createdProduct->categories()->attach([24,34]);




                    $createdProduct->tags()->attach([158]);
                }
                else
                {
                    $row['rate_per_unit_before_commission'] = trim($row['RATE_PER_CT']);
                        $derived_rpu = trim($row['RATE_PER_CT']) / (1+(trim($row['DISCOUNT%'])/100));

                    if(isset($shop->balance->admin_commission_rate_solitaire) && $shop->balance->admin_commission_rate_solitaire > 0)
                    {
                        $row['commission'] = $shop->balance->admin_commission_rate_solitaire;
                        $discountAfterCommission = abs(trim($row['DISCOUNT%']))-$shop->balance->admin_commission_rate_solitaire;
                        $row['customer_discount'] = abs(trim($row['DISCOUNT%'])) - $shop->balance->admin_commission_rate_solitaire_customer;
                        $discount_price_customer = ($row['RAPRATE'] * $row['customer_discount']) / 100;
                        $row['rate_per_unit_customer'] = $row['RAPRATE'] - $discount_price_customer;
                        // $row['RATE_PER_CT'] = $derived_rpu - ($derived_rpu - ($derived_rpu*(1+($discountAfterCommission/100))));
                        $discount_price = ($row['RAPRATE'] * $discountAfterCommission) / 100;
                        $row['RATE_PER_CT'] = $row['RAPRATE'] - $discount_price;
                        $row['DISCOUNT%'] = $discountAfterCommission;
                    }
                    else
                    {
                        $row['commission'] = 0;
                        $discountAfterCommission = abs(trim($row['DISCOUNT%']));
                        // $row['RATE_PER_CT'] = $derived_rpu - ($derived_rpu - ($derived_rpu*(1+($discountAfterCommission/100))));
                        $row['rate_per_unit_customer'] = $row['RATE_PER_CT'];
                        $row['RATE_PER_CT'] = ($row['RAPRATE'] * $discountAfterCommission) / 100;
                        $row['DISCOUNT%'] = $discountAfterCommission;
                    }
                    $update_obj = [
                        'name' => $row['NAME'],
                        'cert_no' => $row['CERT_NO'],
                        'type_name'=> $type_name,
                        //'description' => $row['DESCRIPTION'],
                        'rate_per_unit' => trim($row['RATE_PER_CT']),
                        'rate_per_unit_customer' => trim($row['rate_per_unit_customer']),
                        'price' => trim($row['RATE_PER_CT']) * trim($row['WEIGHT']),
                        'max_price' => trim($row['RATE_PER_CT']),
                        'min_price' => trim($row['RATE_PER_CT']),
                        'sale_price' => (float)trim($row['RATE_PER_CT'])-1,
                        'image_link' => $row['IMAGELINK'],
                        'video_link' => $row['VIDEOLINK'],
                        'certificate_link' => $row['CERTIFICATELINK'],
                        'shape' => $row['SHAPE'],
                        'size' => trim($row['WEIGHT']),
                        'color' => $row['COLOR'],
                        'status' => 'publish',
                        'clarity' => $row['CLARITY'],
                        'cut' => $row['CUT'],
                        'polish' => $row['POLISH'],
                        'symmetry' => $row['SYMMETRY'],
                        'fluorescence' => $row['FLUORESCENCE'],
                        'rap_rate' => $row['RAPRATE'],
                        'amount' => $row['AMOUNT'],
                        'grading' => $row['GRADING'],
                        'location' => $row['LOCATION'],
                        'discount' => trim($row['DISCOUNT%']),
                        'commission' => trim($row['commission']),
                        'rate_per_unit_before_commission' => $row['rate_per_unit_before_commission']
                    ];
                    $already_exists->update($update_obj);
                }
            }
        }
        $updateImportCsvObj = [
            'id'=>$request->id,
            'status'=>'approved',
            'csv_link'=>$import_csv->csv_link,
        ];
        $this->importCsvRepository->updateCsv($updateImportCsvObj);
        return true;
    }

    public function exportSolitaireProducts($shop_id)
    {
        $filename = 'solitaire-products-' . $shop_id . '.csv';
        $headers = [
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=' . $filename,
            'Expires'             => '0',
            'Pragma'              => 'public'
        ];

        $list = $this->repository->where('shop_id', $shop_id)->where('type_id',6)->where('product_type','simple')->where('deleted_at',null)->get()->toArray();
        if (!count($list)) {
            return false;
        }

        # add headers for each column in the CSV download
        array_unshift($list, array_keys($list[0]));

        $callback = function () use ($list) {
            $FH = fopen('php://output', 'w');
            $desiredColumns = array(
                'NAME','STONEID_OR_STYLECODE','SHAPE','WEIGHT','COLOR','CLARITY','CUT','POLISH','SYMMETRY','FLUORESCENCE','GRADING','LOCATION','DISCOUNT%','RATE_PER_CT','IMAGELINK','VIDEOLINK','CERTIFICATELINK','CERT_NO'
            );
            $tableColumns = array(
                'name','stylecode','shape','size','color','clarity','cut','polish','symmetry','fluorescence','grading','location','discount','rate_per_carat','image_link','video_link','certificate_link','cert_no'
            );
            fputcsv($FH, $desiredColumns);
            $counter = 0;
            foreach ($list as $row) {
                // Reorder the row data according to the desired column sequence
                $rowData = array();
                foreach ($tableColumns as $column) {
                    $rowData[] = isset($row[$column]) ? $row[$column] : '';
                }

                if($counter!=0)
                {
                    fputcsv($FH, $rowData);
                }
                $counter++;
            }
            fclose($FH);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importVariationOptions(Request $request)
    {
        $requestFile = $request->file();
        $user = $request->user();
        $shop_id = $request->shop_id;

        if (count($requestFile)) {
            if (isset($requestFile['csv'])) {
                $uploadedCsv = $requestFile['csv'];
            } else {
                $uploadedCsv = current($requestFile);
            }
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.CSV_NOT_FOUND');
        }

        if (!$this->repository->hasPermission($user, $shop_id)) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
        if (isset($user->id)) {
            $file = $uploadedCsv->storePubliclyAs('csv-files', 'variation-options-' . Str::random(5) . '.' . $uploadedCsv->getClientOriginalExtension(), 'public');

            $attributes = $this->repository->csvToArray(storage_path() . '/app/public/' . $file);

            foreach ($attributes as $key => $attribute) {
                if (!isset($attribute['title']) || !isset($attribute['price'])) {
                    throw new MarvelException("MARVEL_ERROR.WRONG_CSV");
                }
                unset($attribute['id']);
                $attribute['options'] = json_decode($attribute['options'], true);
                try {
                    $product = Type::findOrFail($attribute['product_id']);
                    if (isset($product->id)) {
                        VariationOption::firstOrCreate($attribute);
                    }
                } catch (Exception $e) {
                }
            }
            return true;
        }
    }
}
