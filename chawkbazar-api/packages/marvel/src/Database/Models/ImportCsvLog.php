<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;

class ImportCsvLog extends Model
{
    protected $table = 'import_csvs_log';

    public $guarded = [];
}
