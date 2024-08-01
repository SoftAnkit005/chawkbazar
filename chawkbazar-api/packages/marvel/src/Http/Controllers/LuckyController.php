<?php

namespace Marvel\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Marvel\Database\Repositories\LuckyRepository;

class LuckyController extends CoreController
{
    public $repository;

    public function __construct(LuckyRepository $repository)
    {
        $this->repository = $repository;
    }


public function lucky(Request $request)
    {
        return $this->repository->createLucky($request);
    }
}