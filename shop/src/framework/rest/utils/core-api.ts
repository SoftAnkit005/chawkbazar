import pickBy from 'lodash/pickBy';
import Request from './request';
type NumberOrString = number | string;
export type ParamsType = {
  id?:string;
  type?: string;
  text?: string;
  category?: string;
  tags?: string;
  variations?: string;
  type_name?: string;
  shape?:string;
  cut?:string;
  clarity?:string;
  color?:string;
  polish?:string;
  symmetry?:string;
  fluorescence?:string;
  grading?:string;
  location?:string;
  status?: string;
  is_active?: string;
  shop_id?: string;
  limit?: number;
  sortedBy?: string;
  orderBy?: string;
  min_price?: string;
  max_price?: string;
  size?:string;
  discount?:string;
};
export class CoreApi {
  http = Request;
  constructor(public _base_path: string) {}
  private stringifySearchQuery(values: any) {
    const parsedValues = pickBy(values);
    return Object.keys(parsedValues)
      .map((k) => {
        if (k === 'type') {
          return `${k}.slug:${parsedValues[k]};`;
        }
        if (k === 'category') {
          return `categories.slug:${parsedValues[k]};`;
        }
        if (k === 'tags') {
          return `tags.slug:${parsedValues[k]};`;
        }
        if (k === 'variations') {
          return `variations.value:${parsedValues[k]};`;
        }
        if (k === 'type_name') {
          return `type_name:${parsedValues[k]};`;
        }
        if (k === 'shape') {
          return `shape:${parsedValues[k]};`;
        }
        if (k === 'color') {
          return `color:${parsedValues[k]};`;
        }
        if (k === 'cut') {
          return `cut:${parsedValues[k]};`;
        }
        if (k === 'clarity') {
          return `clarity:${parsedValues[k]};`;
        }
        if (k === 'polish') {
          return `polish:${parsedValues[k]};`;
        }
        if (k === 'symmetry') {
          return `symmetry:${parsedValues[k]};`;
        }
        if (k === 'fluorescence') {
          return `fluorescence:${parsedValues[k]};`;
        }
        if (k === 'grading') {
          return `grading:${parsedValues[k]};`;
        }
        if (k === 'location') {
          return `location:${parsedValues[k]};`;
        }
        if (k === 'discount') {
          let disc = +Number(Number(-1*Number(parsedValues[k].replace("-",",").split(',')[0]))-Number(10))+','+-1*Number(parsedValues[k].replace("-",",").split(',')[0]);
          return `discount:${disc};`;
        }
        if (k === 'size') {
          return `size:${parsedValues[k]};`;
        }
        return `${k}:${parsedValues[k]};`;
      })
      .join('')
      .slice(0, -1);
  }
  find(params: ParamsType) {
    const {
      id,
      type,
      text: name,
      category,
      tags,
      variations,
      type_name,
      shape,
      cut,
      clarity,
      polish,
      color,
      symmetry,
      fluorescence,
      grading,
      location,
      size,
      discount,
      status,
      is_active,
      shop_id,
      limit = 30,
      sortedBy="DESC",
      orderBy="created_at",
      min_price,
      max_price
    } = params;
    const searchString = this.stringifySearchQuery({
      id,
      type,
      name,
      category,
      tags,
      variations,
      type_name,
      shape,
      cut,
      clarity,
      polish,
      color,
      symmetry,
      fluorescence,
      grading,
      location,
      size,
      discount,
      status,
      shop_id,
      is_active,
      min_price,
      max_price
    });
    const queryString = `?search=${searchString}&searchJoin=and&limit=${limit}&sortedBy=${sortedBy}&orderBy=${orderBy}`;
    return this.http.get(this._base_path + queryString);
  }
  findAll() {
    return this.http.get(this._base_path);
  }
  fetchUrl(url: string) {
    return this.http.get(url);
  }
  postUrl(url: string, data: any) {
    return this.http.post(url, data);
  }
  findOne(id: NumberOrString) {
    return this.http.get(`${this._base_path}/${id}`);
  }
  create(data: any, options?: any) {
    return this.http
      .post(this._base_path, data, options)
      .then((res) => res.data);
  }
  update(id: NumberOrString, data: any) {
    return this.http
      .put(`${this._base_path}/${id}`, data)
      .then((res) => res.data);
  }
  delete(id: NumberOrString) {
    return this.http.delete(`${this._base_path}/${id}`);
  }
}
