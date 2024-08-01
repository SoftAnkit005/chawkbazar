<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
class AttributeValueLog extends Model
{
    protected $table = 'attribute_value_logs';

    public $guarded = [];

    /**
     * @return BelongsTo
     */
    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }


    /**
     * @return BelongsToMany
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'attribute_product');
    }
}
