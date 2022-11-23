import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../services/productos/productos.service';
import { Producto,
  ProductoResponse, 
  Categoria, 
  CategoriasResponse,
} from '../services/productos/productos.types';
import { AfiliadoService } from '../services/afiliado/afiliado.service';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  // Definiendo variables a utilizar
  protected params: any;
  protected formType: string;
  protected title: string;
  protected productoForm: FormGroup;
  protected afiliadoId: string = '';
  protected tipos_categoria: Categoria[] =[];
  protected loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productosService: ProductosService,
    private afiliadoService: AfiliadoService,
    private loginService: LoginService,
  ) {


    /**
     * Obteniendo parámetros del routing para saber si se está creando o editando un producto
     * y así armar los formularios respectivamente.
     */
     this.params = router.getCurrentNavigation()?.extras.state;
     if (!this.params) {
       this.formType = 'crear';
       this.title = 'Crear producto';
       this.productoForm = this.formBuilder.group({
        idProducto: [0, Validators.required],
        nombreProducto: [null,Validators.required],
        urlFoto: [null, Validators.required],
        precio: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
        idCategoria: [0, Validators.required],
       });
     } else {
       this.formType = 'editar';
       this.title = 'Editar producto';
       this.productoForm = this.formBuilder.group({
        idProducto: [this.params.idProducto, Validators.required],
        nombreProducto: [this.params.nombreProducto, Validators.required],
        urlFoto:[this.params.urlFoto,Validators.required],
        precio: [this.params.precio,Validators.required],
        cedulaJuridica: [{value: this.params.cedulaJuridica, disabled: true },Validators.required,],
        idCategoria:[this.params.idCategoria,Validators.required],
       });
     }
   }
   /**
     * Obteniendo lista de provincias al inicial el componente.
     * Revisa si hay parametros en el componente, de ser asi,
     * utiliza localidadService para cargar las listas de 
     * cantones y provincias que corresponden a los parametros
     * para popular los selectores en el form cuando se quiere
     * editar una sucursal.
     */
  ngOnInit(): void {

        // Obteniendo opciones de categorias
        this.productosService.todasCategorias().subscribe({
          next: (categoriasResponse: CategoriasResponse) => {
            if (categoriasResponse.exito) {
              this.tipos_categoria = categoriasResponse.categorias;
            } else {
              alert('Error al obtener categorias.');
            }
          },
          error: (error) => {
            alert('Error al obtener categorias.');
            console.log(error);
          },
        });

        // Obteniendo cedula juridica afiliado
        this.afiliadoService.cedulaAfiliadoUsuario(this.loginService.idLogin ? this.loginService.idLogin : '').subscribe({
          next: (cedulaAfiliadoResponse: any) => {
            if (cedulaAfiliadoResponse.id) {
              this.afiliadoId = cedulaAfiliadoResponse.id;
            } else {
              alert('Error al obtener cedula juridica de afiliado.');
            }
          },
          error: (error) => {
            alert('Error al obtener cedula juridica de afiliado.');
            console.log(error);
          },
        });

}

  // Getter para acceder facilmente a los form fields
  get productoFormControls() {
    return this.productoForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.productoForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.formType == 'crear') {
      this.productosService
        .crearProducto(this.formatoProducto(this.productoForm.value))
        .subscribe({
          next: (productoResponse: ProductoResponse) => {
            alert(productoResponse.mensaje);
            this.router.navigate(['gestion-productos']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} producto.`);
            console.log(error);
            this.loading = false;
          },
        });
    } else {
      console.log(this.productoForm.value)
      this.productosService
        .editarProducto(this.formatoProducto(this.productoForm.value))
        .subscribe({
          next: (productoResponse: ProductoResponse) => {
            alert(productoResponse.mensaje);
            this.router.navigate(['gestion-productos']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} producto.`);
            console.log(error);
            this.loading = false;
          },
        });
    }
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar un producto
   * con el formato respectivo.
   * @param productoFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Producto.
   */
   formatoProducto(productoFormValues: any) {
    return this.formType === 'editar'
      ? ({
          idProducto: this.params.idProducto,
          nombreProducto: productoFormValues.nombreProducto,
          urlFoto: productoFormValues.urlFoto,
          precio: productoFormValues.precio,
          cedulaJuridica: this.params.cedulaJuridica,
          idCategoria: +productoFormValues.idCategoria,
        } as Producto)
      : ({
          idProducto: productoFormValues.idProducto,
          nombreProducto: productoFormValues.nombreProducto,
          urlFoto: productoFormValues.urlFoto,
          precio: productoFormValues.precio,
          cedulaJuridica: this.afiliadoId,
          idCategoria: +productoFormValues.idCategoria,
        } as Producto);
  }
}