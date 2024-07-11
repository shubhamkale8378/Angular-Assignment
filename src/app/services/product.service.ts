import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../Interfaces/interface';
import { ConfigURL } from '../config/configurl';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient)

  constructor() { }
  mainURL = ConfigURL.baseURL
  postProduct(url: any, product: Product) {
    return this.http.post<Product>(this.mainURL + url, product)
  }

  getProduct(url: any) {
    return this.http.get<Product>(this.mainURL + url);
  }

  getProductById(url: any, id: any) {
    return this.http.get<Product>(this.mainURL + url + id);
  }

  updateProduct(url: any, id: any, data: any) {
    return this.http.put<Product>(this.mainURL + url + "/" + id, data);
  }

  deleteProduct(url: any, id: any) {
    return this.http.delete<Product>(this.mainURL + url + "/" + id);
  }

}
