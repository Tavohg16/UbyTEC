import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../services/productos/productos.service';
import {
    ProductosResponse,
    ProductoResponse,
    Producto
} from '../services/productos/productos.types'

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit {
  protected productos: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ObtenerProductos();
  }
  /**
   * Esta función llama al servicio de productos, obtiene todos los productos de la base de datos
   * y actualiza la lista de productos del componente.
   */
   protected ObtenerProductos(): void {
    this.productosService.todosProductos().subscribe({
      next: (productosResponse: ProductosResponse) => {
        if (productosResponse.exito) {
          this.productos = productosResponse.productos.sort(
            (productoA,productoB) => {
              return productoA.nombreProducto.localeCompare(
                productoB.nombreProducto
              );
            }
          );
          console.log(this.productos)
        } else {
          alert('Error al obtener productos.');
        }
      },
      error: (error) => {
        alert('Error al obtener productos.');
        console.log(error);
      },
    });
  }

   /**
   * Función para navegar a la pantalla de crear producto.
   */
       protected crearProducto() {
        this.router.navigate(['producto']);
      }

   /**
   * Función para navegar a la pantalla de editar producto.
   */
      protected editarProducto(producto: Producto) {
        this.router.navigate(['producto'], {state: producto});
      }

  /**
   * Función para borrar un producto haciendo uso del servicio de gestion-productos.
   * @param idProducto id del producto que se quiere eliminar.
   */
   protected borrarProducto(id: number) {
    this.productosService.borrarProducto(id).subscribe({
      next: (productoResponse: ProductoResponse ) => {
        alert(productoResponse.mensaje);
        this.ObtenerProductos()
      },
      error: (error) => {
        alert(`Error al eliminar producto.`);
        console.log(error);
      },
    });
  }



}