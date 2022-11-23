import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {LoginService} from '../login/login.service';
import {
  ProductosResponse,
  ProductoResponse,
  Producto,
  CategoriasResponse
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
  
  /**
   * Metodo crear un producto.
   * @returns observable del query: Observable<ProductoResponse[]>.
   */
   crearProducto(producto: Producto) {
    const body = JSON.stringify(producto);
    return this.http.post<ProductoResponse>(
      this.ProductosUrl,
      body,
      this.httpOptions
    );
  }

  /**
   * Metodo obtener todos las categorias posibles que puede tener un producto.
   * @returns observable del query: Observable<RolesResponse[]>.
   */
     todasCategorias() {
      return this.http.get<CategoriasResponse>(
        `${this.ProductosUrl}/category`,
        this.httpOptions
      );
    }

  /**
   * Metodo editar un producto.
   * @returns observable del query: Observable<ProductoResponse[]>.
   */
  editarProducto(producto: Producto) {
    const body = JSON.stringify(producto);
    return this.http.patch<ProductoResponse>(
      this.ProductosUrl,
      body,
      this.httpOptions
    );
  }
}