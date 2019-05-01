import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from './ProductModel';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(private http: HttpClient) { }



  getAllProducts(){
    return this.http.get<ProductModel[]>(BASE_URL + 'Products');
  }

  getProductById(id: string){
    return this.http.get<ProductModel>(BASE_URL + 'Products' + '/' + id);
  }

  addProduct(product: ProductModel){
    return this.http.post(BASE_URL + 'Products', product);
  }

  deleteProduct(id: string){
    return this.http.delete(BASE_URL + 'Products' + '/' + id);
  }

  updateProduct(product: ProductModel){
    return this.http.put(BASE_URL + 'Products' + '/' + product._id, product);
  }
}
