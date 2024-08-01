<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;

class ImportCsv extends Model
{
    protected $table = 'import_csvs';

    public $guarded = [];
}
