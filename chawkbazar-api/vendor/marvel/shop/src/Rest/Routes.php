<?php


use Illuminate\Support\Facades\Route;

use Marvel\Http\Controllers\AddressController;
use Marvel\Http\Controllers\AttributeController;
use Marvel\Http\Controllers\CustomerTypeController;
use Marvel\Http\Controllers\AttributeValueController;
use Marvel\Http\Controllers\ProductController;
use Marvel\Http\Controllers\SettingsController;
use Marvel\Http\Controllers\UserController;
use Marvel\Http\Controllers\TypeController;
use Marvel\Http\Controllers\OrderController;
use Marvel\Http\Controllers\OrderStatusController;
use Marvel\Http\Controllers\CategoryController;
use Marvel\Http\Controllers\CouponController;
use Marvel\Http\Controllers\AttachmentController;
use Marvel\Http\Controllers\ShippingController;
use Marvel\Http\Controllers\TaxController;
use Marvel\Enums\Permission;
use Marvel\Http\Controllers\ShopController;
use Marvel\Http\Controllers\ShopBannerController;
use Marvel\Http\Controllers\MenuBuilderController;
use Marvel\Http\Controllers\ShopUnderMaintainanceController;
use Marvel\Http\Controllers\TagController;
use Marvel\Http\Controllers\WithdrawController;

Route::post('/register', 'Marvel\Http\Controllers\UserController@register');
Route::post('/token', 'Marvel\Http\Controllers\UserController@token');
Route::post('/logout', 'Marvel\Http\Controllers\UserController@logout');
Route::post('/forget-password', 'Marvel\Http\Controllers\UserController@forgetPassword');
Route::post('/verify-forget-password-token', 'Marvel\Http\Controllers\UserController@verifyForgetPasswordToken');
Route::post('/reset-password', 'Marvel\Http\Controllers\UserController@resetPassword');
Route::post('/contact-us', 'Marvel\Http\Controllers\UserController@contactAdmin');
Route::post('/social-login-token', 'Marvel\Http\Controllers\UserController@socialLogin');
Route::post('/send-otp-code', 'Marvel\Http\Controllers\UserController@sendOtpCode');
Route::get('/send-manual-otp-code', 'Marvel\Http\Controllers\UserController@sendManualOtpCode');
Route::get('/is-user-contact-exists', 'Marvel\Http\Controllers\UserController@isUserContactExists');
Route::get('/show-user-with-profile-and-address/{id}', 'Marvel\Http\Controllers\UserController@showWithProfileAndAddress');
Route::post('/verify-otp-code', 'Marvel\Http\Controllers\UserController@verifyOtpCode');
Route::post('/otp-login', 'Marvel\Http\Controllers\UserController@otpLogin');
Route::post('/lucky', 'Marvel\Http\Controllers\LuckyController@lucky');

Route::apiResource('customer-types', CustomerTypeController::class, [
    'only' => ['index', 'show']
]);
Route::apiResource('products', ProductController::class, [
    'only' => ['index', 'show']
]);
Route::apiResource('shop-under-maintainance', ShopUnderMaintainanceController::class, [
    'only' => ['show','update']
]);
Route::apiResource('types', TypeController::class, [
    'only' => ['index', 'show']
]);
Route::apiResource('attachments', AttachmentController::class, [
    'only' => ['index', 'show']
]);
Route::apiResource('categories', CategoryController::class, [
    'only' => ['index', 'show']
]);
Route::apiResource('tags', TagController::class, [
    'only' => ['index', 'show']
]);

Route::get('featured-categories', 'Marvel\Http\Controllers\CategoryController@fetchFeaturedCategories');

// Route::get('fetch-parent-category', 'Marvel\Http\Controllers\CategoryController@fetchOnlyParent');
// Route::get('fetch-category-recursively', 'Marvel\Http\Controllers\CategoryController@fetchCategoryRecursively');

Route::apiResource('coupons', CouponController::class, [
    'only' => ['index', 'show']
]);

Route::post('coupons/verify', 'Marvel\Http\Controllers\CouponController@verify');


Route::apiResource('order-status', OrderStatusController::class, [
    'only' => ['index', 'show']
]);

Route::apiResource('attributes', AttributeController::class, [
    'only' => ['index', 'show']
]);


Route::apiResource('shops', ShopController::class, [
    'only' => ['index', 'show']
]);

Route::apiResource('shop-banners', ShopBannerController::class, [
    'only' => ['index', 'show', 'store', 'update', 'destroy']
]);

Route::apiResource('menu-builder', MenuBuilderController::class, [
    'only' => ['index', 'show', 'store', 'update', 'destroy']
]);

Route::apiResource('attribute-values', AttributeValueController::class, [
    'only' => ['index', 'show']
]);

Route::apiResource('settings', SettingsController::class, [
    'only' => ['index']
]);

Route::apiResource('attachments', AttachmentController::class, [
    'only' => ['store', 'update', 'destroy']
]);

Route::group(['middleware' => ['can:' . Permission::CUSTOMER, 'auth:sanctum']], function () {
    Route::apiResource('orders', OrderController::class, [
        'only' => ['index', 'show', 'store']
    ]);
    Route::get('orders/tracking-number/{tracking_number}', 'Marvel\Http\Controllers\OrderController@findByTrackingNumber');
    Route::post('orders/checkout/verify', 'Marvel\Http\Controllers\CheckoutController@verify');
    Route::get('me', 'Marvel\Http\Controllers\UserController@me');
    Route::put('users/{id}', 'Marvel\Http\Controllers\UserController@update');
    Route::post('/change-password', 'Marvel\Http\Controllers\UserController@changePassword');
    Route::post('/update-contact', 'Marvel\Http\Controllers\UserController@updateContact');
    Route::apiResource('address', AddressController::class, [
        'only' => ['destroy']
    ]);
});

Route::get('orders/checkout/get-all-taxes', 'Marvel\Http\Controllers\CheckoutController@getAllTaxes');

Route::get('popular-products', 'Marvel\Http\Controllers\AnalyticsController@popularProducts');

Route::group(
    ['middleware' => ['permission:' . Permission::STAFF . '|' . Permission::STORE_OWNER, 'auth:sanctum']],
    function () {
        Route::get('analytics', 'Marvel\Http\Controllers\AnalyticsController@analytics');
        Route::apiResource('products', ProductController::class, [
            'only' => ['store', 'update', 'destroy']
        ]);
        Route::apiResource('attributes', AttributeController::class, [
            'only' => ['store', 'update', 'destroy']
        ]);
        Route::apiResource('customer-types', CustomerTypeController::class, [
            'only' => ['store', 'update']
        ]);
        Route::apiResource('attribute-values', AttributeValueController::class, [
            'only' => ['store', 'update', 'destroy']
        ]);
        Route::apiResource('orders', OrderController::class, [
            'only' => ['update', 'destroy']
        ]);
    }
);

Route::post('multiple-publish-products', 'Marvel\Http\Controllers\ProductController@multiplepublish');
Route::post('import-products', 'Marvel\Http\Controllers\ProductController@importProducts');
Route::post('import-variation-options', 'Marvel\Http\Controllers\ProductController@importVariationOptions');
Route::get('export-products/{shop_id}', 'Marvel\Http\Controllers\ProductController@exportProducts');
Route::get('export-variation-options/{shop_id}', 'Marvel\Http\Controllers\ProductController@exportVariableOptions');
Route::post('import-attributes', 'Marvel\Http\Controllers\AttributeController@importAttributes');
Route::get('export-attributes', 'Marvel\Http\Controllers\AttributeController@exportAttributes');
Route::get('download-solitaire-sample-file', 'Marvel\Http\Controllers\AttributeController@downloadSolitaireSampleFile');
Route::post('import-solitaire-products', 'Marvel\Http\Controllers\ProductController@importSolitaireProducts');
Route::post('delete-solitaire-products', 'Marvel\Http\Controllers\ProductController@deleteSolitaireProducts');
Route::post('import-solitaire-csv', 'Marvel\Http\Controllers\ProductController@importSolitaireCsv');
Route::get('imported-csvs', 'Marvel\Http\Controllers\ProductController@importedCsvs');
Route::get('export-solitaire-products/{shop_id}', 'Marvel\Http\Controllers\ProductController@exportSolitaireProducts');
Route::get('solitaireindex', 'Marvel\Http\Controllers\ProductController@solitaireindex');
Route::get('nonsolitaireindex', 'Marvel\Http\Controllers\ProductController@nonsolitaireindex');

Route::group(
    ['middleware' => ['permission:' . Permission::STORE_OWNER, 'auth:sanctum']],
    function () {
        Route::apiResource('shops', ShopController::class, [
            'only' => ['store', 'update', 'destroy']
        ]);
        Route::apiResource('withdraws', WithdrawController::class, [
            'only' => ['store', 'index', 'show']
        ]);
        Route::post('staffs', 'Marvel\Http\Controllers\ShopController@addStaff');
        Route::delete('staffs/{id}', 'Marvel\Http\Controllers\ShopController@deleteStaff');
        Route::get('staffs', 'Marvel\Http\Controllers\UserController@staffs');
        Route::get('my-shops', 'Marvel\Http\Controllers\ShopController@myShops');
    }
);


Route::group(['middleware' => ['permission:' . Permission::SUPER_ADMIN, 'auth:sanctum']], function () {
    Route::apiResource('types', TypeController::class, [
        'only' => ['store', 'update', 'destroy']
    ]);
    Route::apiResource('withdraws', WithdrawController::class, [
        'only' => ['update', 'destroy']
    ]);
    Route::apiResource('categories', CategoryController::class, [
        'only' => ['store', 'update', 'destroy']
    ]);
    Route::apiResource('tags', TagController::class, [
        'only' => ['store', 'update', 'destroy']
    ]);
    Route::apiResource('coupons', CouponController::class, [
        'only' => ['store', 'update', 'destroy']
    ]);
    Route::apiResource('order-status', OrderStatusController::class, [
        'only' => ['store', 'update', 'destroy']
    ]);

    Route::apiResource('settings', SettingsController::class, [
        'only' => ['store']
    ]);
    Route::apiResource('users', UserController::class);
    Route::post('users/block-user', 'Marvel\Http\Controllers\UserController@banUser');
    Route::post('users/unblock-user', 'Marvel\Http\Controllers\UserController@activeUser');
    Route::apiResource('taxes', TaxController::class);
    Route::apiResource('shippings', ShippingController::class);
    Route::post('approve-shop', 'Marvel\Http\Controllers\ShopController@approveShop');
    Route::post('approve-business', 'Marvel\Http\Controllers\ShopController@approveBusiness');
    Route::post('disapprove-shop', 'Marvel\Http\Controllers\ShopController@disApproveShop');
    Route::post('approve-withdraw', 'Marvel\Http\Controllers\WithdrawController@approveWithdraw');
});
