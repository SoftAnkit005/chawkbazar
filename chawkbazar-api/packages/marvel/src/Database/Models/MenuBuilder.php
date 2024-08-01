<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;

class MenuBuilder extends Model
{
    protected $table = 'menu_builder';

    public $guarded = [];

    protected $casts = [
        'icon'   => 'json',
        'banners'   => 'json',
    ];
}
