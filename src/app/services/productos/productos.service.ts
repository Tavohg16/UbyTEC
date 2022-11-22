import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {LoginService} from '../login/login.service';
import {
  ProductosResponse,
  ProductoResponse,
  Producto
} from './productos.types'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  // Definiendo ruta a la que se hara los request http relacionados a los productos
  private ProductosUrl: string = `${environment.apiUrl}/manage/producto`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    })
  }

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { }

  /**
   * Metodo para obtener la lista de todos los productos.
   * @returns observable del query: Observable<ProductosResponse[]>.
   */
   todosProductos() {
    return this.http.get<ProductosResponse>(
      `${this.ProductosUrl+"/usr"+"/"+ window.localStorage.getItem('id')}`,
      this.httpOptions
    );
  }

  /**
   * Metodo borrar un producto.
   * @returns observable del query: Observable<ProductosResponse[]>.
   */
   borrarProducto(id: number) {
    const body = JSON.stringify({id});
    return this.http.delete<ProductoResponse>(
      this.ProductosUrl,
      {...this.httpOptions, body }
    );
  }
}