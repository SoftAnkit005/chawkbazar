<?php

namespace Marvel\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


class MenuBuilderRequest extends FormRequest
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
        'label' => ['required', 'string'],
        'path' => ['required', 'string'],
        'category' => ['numeric'],
        'sequence' => ['required','numeric'],
        'categoryName' => ['string','nullable'],
        'type' => ['required', 'string'],
        'tag' => ['numeric'],
        'tagName' => ['string','nullable'],
        'parentName' => ['string','nullable'],
        'bannerSlug1' => ['string','nullable'],
        'bannerSlug2' => ['string','nullable'],
        'parent' => ['required', 'numeric']
        ];
    }

    public function failedValidation(Validator $validator)
    {
        // TODO: Need to check from the request if it's coming from GraphQL API or not.
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
