import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepartidoresService } from '../services/repartidores/repartidores.service';
import { LocalizacionService } from '../services/localizacion/localizacion.service';
import { 
  Localidad,
  LocalidadesResponse
} from '../services/localizacion/localizacion.types'
import { Repartidor, RepartidorResponse, } from '../services/repartidores/repartidores.types';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.component.html',
  styleUrls: ['./repartidor.component.css']
})
export class RepartidorComponent implements OnInit {
  // Definiendo variables a utilizar
  protected params: any;
  protected formType: string;
  protected title: string;
  protected lista_provincias: Localidad[] = [];
  protected lista_cantones: Localidad[] = [];
  protected lista_distritos: Localidad[] = [];
  protected id_provincia: string ="";
  protected nombre_provincia: string = "";
  protected id_canton: string ="";
  protected nombre_canton: string = "";
  protected id_distrito: string = "";
  protected nombre_distrito: string = "";
  protected repartidorForm: FormGroup;
  protected loading: boolean = false;
  protected disponible: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localidadService: LocalizacionService,
    private repartidoresService: RepartidoresService
  ) {


    /**
     * Obteniendo parámetros del routing para saber si se está creando o editando un repartidor
     * y así armar los formularios respectivamente.
     */
     this.params = router.getCurrentNavigation()?.extras.state;
     if (!this.params) {
       this.formType = 'crear';
       this.title = 'Crear repartidor';
       this.repartidorForm = this.formBuilder.group({
        usuarioRepart: [null,Validators.required], 
        nombre: [null, Validators.required],
        primerApellido: [null, Validators.required],
        segundoApellido: [null, Validators.required],
        correoRepart: [null,Validators.required],
        passwordRepart: [null, Validators.required],
        provincia: [0, Validators.required],
        canton: [0, Validators.required],
        distrito: [0, Validators.required],
        telefono_1: [null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
        telefono_2: [null, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
       });
     } else {
       this.formType = 'editar';
       this.title = 'Editar repartidor';
       this.repartidorForm = this.formBuilder.group({
        usuarioRepart: [{ value: this.params.usuarioRepart, disabled: true },Validators.required,],
        nombre: [this.params.nombre, Validators.required],
        primerApellido: [this.params.primerApellido, Validators.required],
        segundoApellido: [this.params.segundoApellido, Validators.required],
        correoRepart: [this.params.correoRepart,Validators.required],
        passwordRepart: [this.params.passwordRepart, Validators.required],
        provincia: ["", Validators.required],
        canton: ["", Validators.required],
        distrito: ["", Validators.required],
        telefono_1: [
            this.params.telefonos[0],
            [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
          ],
          telefono_2: [
            this.params.telefonos[1] ? this.params.telefonos[1] : null,
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          ],
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

    this.localidadService.ObtenerProvincias().subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_provincias = localidadesResponse.data;

        if(this.params){
          this.id_provincia = this.identificarProvincia(this.params.provincia);
          this.repartidorForm.value.provincia = this.id_provincia;

          this.localidadService.ObtenerCantones(this.id_provincia).subscribe({
            next: (localidadesResponse: LocalidadesResponse) => {
              this.lista_cantones = localidadesResponse.data;
              this.id_canton = this.identificarCanton(this.params.canton);
              this.repartidorForm.value.canton = this.id_canton;

              this.localidadService.ObtenerDistritos(this.id_provincia,this.id_canton).subscribe({
                next: (localidadesResponse: LocalidadesResponse) => {
                  this.lista_distritos = localidadesResponse.data;
                  this.id_distrito = this.identificarDistrito(this.params.distrito);
                  this.repartidorForm.value.distrito = this.id_distrito;
                  this.repartidorForm.patchValue(this.repartidorForm.value, { onlySelf: false, emitEvent: true });
                }
              });
            }
          });
        }        
      }
    });
  }

  /**
     * Obtiene el value del selector de provincia @param provincia,
     * guarda el nombre de la provincia localmente y procede a usar el
     * localidadService para obtener la lista de cantones correspondiente
     * a la provincia seleccionada por el usurio.
     */
  seleccionarProvincia(provincia:string): void {
    this.id_provincia = provincia;
    const index = Number(this.id_provincia) - 1;
    this.nombre_provincia = this.lista_provincias[index].nombre;
    this.localidadService.ObtenerCantones(this.id_provincia).subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_cantones = localidadesResponse.data;
      }  
    })
  }

  /**
     * Obtiene el value del selector de canton @param canton,
     * guarda el nombre del canton localmente y procede a usar el
     * localidadService para obtener la lista de distritos correspondiente
     * al canton seleccionada por el usurio.
     */
  seleccionarCanton(canton:string): void {
    this.id_canton = canton;
    const index = Number(this.id_canton) - 1;
    this.nombre_canton = this.lista_cantones[index].nombre;
    this.localidadService.ObtenerDistritos(this.id_provincia,this.id_canton).subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_distritos = localidadesResponse.data;
      }
    })
  }

  /**
     * Obtiene el value del selector de distrito @param distrito,
     * guarda el nombre del distrito localmente.
     */
  seleccionarDistrito(distrito:string): void {
    this.id_distrito = distrito;
    const index = Number(this.id_distrito) - 1;
    this.nombre_distrito = this.lista_distritos[index].nombre;
  }

  /**
   * dado @param value como el string que representa el nombre de una provincia,
   * se obtiene de la lista de provincias el elemento que haga match y se obtiene
   * el numero de provincia que luego es convertido a string.
   * @returns un string que representa el identificador numerico de una provincia.
   */
  identificarProvincia(value:string): string {
    this.nombre_provincia = value;
    let numero:string = "";
    this.lista_provincias.forEach(element => {
      if(element.nombre === value){
        numero = element.numero.toString();
      }
    });
    return numero;
  }

  /**
   * dado @param value como el string que representa el nombre de un canton,
   * se obtiene de la lista de cantones el elemento que haga match y se obtiene
   * el numero de canton que luego es convertido a string.
   * @returns un string que representa el identificador numerico de un canton.
   */
  identificarCanton(value:string): string {
    this.nombre_canton = value;
    let numero:string = "";
    this.lista_cantones.forEach(element => {
      if(element.nombre === value){
        numero = element.numero.toString();
      }
    });
    return numero;
  }

    /**
   * dado @param value como el string que representa el nombre de un distrito,
   * se obtiene de la lista de distritos el elemento que haga match y se obtiene
   * el numero de distrito que luego es convertido a string.
   * @returns un string que representa el identificador numerico de un distrito.
   */
  identificarDistrito(value:string): string {
    this.nombre_distrito = value;
    let numero:string = "";
    this.lista_distritos.forEach(element => {
      if(element.nombre === value){
        numero = element.numero.toString();
      }
    });
    return numero;
  }
  // Getter para acceder facilmente a los form fields
  get repartidorFormControls() {
    return this.repartidorForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.repartidorForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.formType == 'crear') {
      this.repartidoresService
        .crearRepartidor(this.formatoRepartidor(this.repartidorForm.value))
        .subscribe({
          next: (repartidorResponse: RepartidorResponse) => {
            alert(repartidorResponse.mensaje);
            this.router.navigate(['gestion-repartidores']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} repartidor.`);
            console.log(error);
            this.loading = false;
          },
        });
    } else {
      this.repartidoresService
        .editarRepartidor(this.formatoRepartidor(this.repartidorForm.value))
        .subscribe({
          next: (repartidorResponse: RepartidorResponse) => {
            alert(repartidorResponse.mensaje);
            this.router.navigate(['gestion-repartidores']);
            this.loading = false;
          },
          error: (error) => {
            alert(`Error al ${this.formType} repartidor.`);
            console.log(error);
            this.loading = false;
          },
        });
    }
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar o agregar un repartidor
   * con el formato respectivo.
   * @param repartidorFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Repartidor.
   */
   formatoRepartidor(repartidorFormValues: any) {
    return this.formType === 'editar'
      ? ({
          usuarioRepart: this.params.usuarioRepart,
          nombre: repartidorFormValues.nombre,
          primerApellido: repartidorFormValues.primerApellido,
          segundoApellido: repartidorFormValues.segundoApellido,
          correoRepart: repartidorFormValues.correoRepart,
          passwordRepart: repartidorFormValues.passwordRepart,
          provincia: this.nombre_provincia,
          canton: this.nombre_canton,
          distrito: this.nombre_distrito,
          telefonos: repartidorFormValues.telefono_2
          ? [repartidorFormValues.telefono_2, repartidorFormValues.telefono_1]
          : [repartidorFormValues.telefono_1],
          disponible: this.params.disponible,
        } as Repartidor)
      : ({
          usuarioRepart: repartidorFormValues.usuarioRepart,
          nombre: repartidorFormValues.nombre,
          primerApellido: repartidorFormValues.primerApellido,
          segundoApellido: repartidorFormValues.segundoApellido,
          correoRepart: repartidorFormValues.correoRepart,
          passwordRepart: repartidorFormValues.passwordRepart,
          provincia: this.nombre_provincia,
          canton: this.nombre_canton,
          distrito: this.nombre_distrito,
          telefonos: repartidorFormValues.telefono_2
          ? [repartidorFormValues.telefono_2, repartidorFormValues.telefono_1]
          : [repartidorFormValues.telefono_1],
          disponible: true,
        } as Repartidor);
  }
}