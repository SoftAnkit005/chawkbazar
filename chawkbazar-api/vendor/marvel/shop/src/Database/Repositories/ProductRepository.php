<?php


namespace Marvel\Database\Repositories;

use Exception;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\Product;
use Marvel\Enums\ProductType;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Prettus\Validator\Exceptions\ValidatorException;

class ProductRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',
        'shop_id',
        'status',
        'type.slug' => 'in',
        'categories.slug' => 'in',
        'shape' => 'in',
        'tags.slug' => 'in',
        'variations.value' => 'in',
        'min_price' => 'between',
        'size' => 'between',
        'discount' => 'between',
        'color' => 'in',
        'clarity' => 'in',
        'cut' => 'in',
        'polish' => 'in',
        'symmetry' => 'in',
        'fluorescence' => 'in',
        'grading' => 'in',
        'location' => 'in',
        'max_price' => '>='
    ];

    protected $dataArray = [
        'name',
        'stylecode',
        'hsn',
        'price',
        'sale_price',
        'max_price',
        'min_price',
        'type_id',
        'product_type',
        'quantity',
        'unit',
        'makingCharges',
        'zero_inventory_fill',
        'description',
        'sku',
        'image',
        'video',
        'gallery',
        'status',
        'height',
        'length',
        'width',
        'image_link',
        'video_link',
        'certificate_link',
        'cert_no',
        'shape',
        'size',
        'discount',
        'rate_per_unit',
        'commission',
        'rate_per_unit_before_commission',
        'color',
        'clarity',
        'cut',
        'polish',
        'symmetry',
        'fluorescence',
        'grading',
        'location',
        'in_stock',
        'is_taxable',
        'shop_id',
        'buy_back_policy',
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
        return Product::class;
    }

    public function storeProduct($request)
    {
        try {
            $data = $request->only($this->dataArray);
            $product = $this->create($data);
            if (isset($request['categories'])) {
                $product->categories()->attach($request['categories']);
            }
            if (isset($request['tags'])) {
                $product->tags()->attach($request['tags']);
            }
            if (isset($request['variations'])) {
                $product->variations()->attach($request['variations']);
            }
            if (isset($request['variation_options'])) {
                foreach($request['variation_options']['upsert'] as $variation)
                {
                    unset($variation['percent']);
                    unset($variation['diamondWeightInG']);
                    $product->variation_options()->create($variation);    
                }
            }
            $product->categories = $product->categories;
            $product->variation_options = $product->variation_options;
            $product->variations = $product->variations;
            $product->type = $product->type;
            $product->tags = $product->tags;
            return $product;
        } catch (ValidatorException $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function updateProduct($request, $id)
    {
        try {
            $product = $this->findOrFail($id);
            if (isset($request['categories'])) {
                $product->categories()->sync($request['categories']);
            }
            if (isset($request['tags'])) {
                $product->tags()->sync($request['tags']);
            }
            if (isset($request['variations'])) {
                $product->variations()->sync($request['variations']);
            }
            if (isset($request['variation_options'])) {
                if (isset($request['variation_options']['upsert'])) {
                    foreach ($request['variation_options']['upsert'] as $key => $variation) {
                        unset($variation['percent']);
                        unset($variation['diamondWeightInG']);
                        if (isset($variation['id'])){
                            $product->variation_options()->where('id', $variation['id'])->update($variation);
                        } else {
                            $product->variation_options()->create($variation);
                        }
                    }
                }
                if (isset($request['variation_options']['delete'])) {
                    foreach ($request['variation_options']['delete'] as $key => $id) {
                        try {
                            $product->variation_options()->where('id', $id)->delete();
                        } catch (Exception $e) {
                        }
                    }
                }
            }
            $product->update($request->only($this->dataArray));
            if ($product->product_type === ProductType::SIMPLE) {
                $product->variations()->delete();
                $product->variation_options()->delete();
            }
            $product->categories = $product->categories;
            $product->variation_options = $product->variation_options;
            $product->variations = $product->variations;
            $product->type = $product->type;
            $product->tags = $product->tags;
            return $product;
        } catch (ValidatorException $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function fetchRelated($slug, $limit = 10)
    {
        try {
            $product = $this->findOneByFieldOrFail('slug', $slug);
            $categories = $product->categories->pluck('id');
            $products = $this->whereHas('categories', function ($query) use ($categories) {
                $query->whereIn('categories.id', $categories);
            })->with('type')->limit($limit);
            return $products;
        } catch (Exception $e) {
            return [];
        }
    }
}
