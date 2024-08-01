<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mail;
class webmail extends Controller
{
    public function index(){
        $data=['name'=>"Saurav", 'data'=>"Hello Saurav"];
        $user='ansh@zweler.com';
        Mail::send('mail',$data,function($messages) use ($user){
            $messages->to('ashudave4444@gmail.com');
            $messages->subject('Hello Saurav');
        });
    }
}
