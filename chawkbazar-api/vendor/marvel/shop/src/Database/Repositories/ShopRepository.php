<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Shop;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Prettus\Validator\Exceptions\ValidatorException;

class ShopRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',
        'is_active',
        'categories.slug',
    ];

    /**
     * @var array
     */
    protected $dataArray = [
        'name',
        'vendor_code',
        'description',
        'cover_image',
        'logo',
        'is_active',
        'address',
        'settings',
        'buy_back_policy'
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
        return Shop::class;
    }

    public function storeShop($request)
    {
        try {
            $data = $request->only($this->dataArray);
            $data['owner_id'] = $request->user()->id;
            $shop = $this->create($data);
            if (isset($request['categories'])) {
                $shop->categories()->attach($request['categories']);
            }
            if (isset($request['balance']['payment_info'])) {
                $balance = $request['balance'];
                $balance['payment_info']['account'] = $balance['payment_info']['accounts'];
                unset($balance['payment_info']['accounts']);
                $shop->balance()->create($balance);
            }
            $shop->categories = $shop->categories;
            $shop->staffs = $shop->staffs;
            return $shop;
        } catch (ValidatorException $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function updateShop($request, $id)
    {
        try {
            $shop = $this->findOrFail($id);
            if (isset($request['categories'])) {
                $shop->categories()->sync($request['categories']);
            }
            if (isset($request['balance'])) {
                $balance = $request['balance'];
                $balance['payment_info']['account'] = $balance['payment_info']['accounts'];
                unset($balance['payment_info']['accounts']);
                if (isset($request['balance']['admin_commission_rate']) && $shop->balance->admin_commission_rate !== $request['balance']['admin_commission_rate']) {
                    if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                        $this->updateBalance($balance, $id);
                    }
                }
                else if (isset($request['balance']['admin_commission_rate_solitaire']) && $shop->balance->admin_commission_rate_solitaire !== $request['balance']['admin_commission_rate_solitaire']) {
                    if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                        $this->updateBalance($balance, $id);
                    }
                }
                else {
                    $this->updateBalance($balance, $id);
                }
            }
            $shop->update($request->only($this->dataArray));
            $shop->categories = $shop->categories;
            $shop->staffs = $shop->staffs;
            $shop->balance = $shop->balance;
            return $shop;
        } catch (ValidatorException $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function updateBalance($balance, $shop_id)
    {
        if (isset($balance['id'])) {
            Balance::findOrFail($balance['id'])->update($balance);
        } else {
            $balance['shop_id'] = $shop_id;
            Balance::create($balance);
        }
    }
}
