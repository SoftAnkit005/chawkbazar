<?php

namespace Marvel\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


class ShopBannerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
        'title' => ['required', 'string'],
        'slug' => ['required', 'string'],
        'imageMobileUrl' => ['required', 'string'],
        'imageMobileWidth' => ['required', 'numeric'],
        'imageMobileHeight' => ['required', 'numeric'],
        'imageDesktopUrl' => ['required', 'string'],
        'imageDesktopWidth' => ['required', 'numeric'],
        'imageDesktopHeight' => ['required', 'numeric'],
        'sequence' => ['numeric'],
        'type' => ['required', 'string'],
        'bannerType' => ['required', 'string']
        ];
    }

    public function failedValidation(Validator $validator)
    {
        // TODO: Need to check from the request if it's coming from GraphQL API or not.
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
