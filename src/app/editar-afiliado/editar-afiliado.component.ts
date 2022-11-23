import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalizacionService } from '../services/localizacion/localizacion.service';
import {
  Localidad,
  LocalidadesResponse,
} from '../services/localizacion/localizacion.types';
import { AfiliadoService } from '../services/afiliado/afiliado.service';
import { TiposComercioService } from '../services/tipos-comercio/tipos-comercio.service';
import {
  Afiliado,
  AfiliadoAdminResponse,
  AfiliadoResponse,
} from '../services/afiliado/afiliado.types';
import {
  TipoComercio,
  TiposComercioResponse,
} from '../services/tipos-comercio/tipo-comercio.types';

@Component({
  selector: 'app-afiliado',
  templateUrl: './editar-afiliado.component.html',
  styleUrls: ['./editar-afiliado.component.css'],
})
export class EditarAfiliadoComponent implements OnInit {
  // Definiendo variables a utilizar
  protected afiliadoId: any;
  protected afiliado: any;
  protected tiposComercio: TipoComercio[];
  protected title: string = 'Editar afiliado';
  protected lista_provincias: Localidad[] = [];
  protected lista_cantones: Localidad[] = [];
  protected lista_distritos: Localidad[] = [];
  protected id_provincia: string = '';
  protected nombre_provincia: string = '';
  protected id_canton: string = '';
  protected nombre_canton: string = '';
  protected id_distrito: string = '';
  protected nombre_distrito: string = '';
  protected afiliadoForm: FormGroup;
  protected loading: boolean = false;
  protected disponible: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localidadService: LocalizacionService,
    private afiliadoService: AfiliadoService,
    private tiposComercioService: TiposComercioService,
    private activatedRoute: ActivatedRoute
  ) {
    this.tiposComercio = [];
    this.tiposComercioService.todosTiposComercio().subscribe({
      next: (tipoComercioResponse: TiposComercioResponse) => {
        if (tipoComercioResponse.exito) {
          this.tiposComercio = tipoComercioResponse.tipos;
        } else {
          alert('Error al obtener tipos de comercio.');
        }
      },
      error: (error) => {
        alert('Error al obtener tipos de comercio.');
        console.log(error);
      },
    });
    this.afiliado = {};
    this.afiliadoForm = this.formBuilder.group({
      cedulaJuridica: [{ value: null, disabled: true }, Validators.required],
      nombreComercio: [null, Validators.required],
      sinpeMovil: [null, Validators.required],
      correo: [null, Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      tipo: [null, Validators.required],
      telefono_1: [
        null,
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      telefono_2: [null, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
    });
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.afiliadoId = paramMap.get('id');
      if (this.afiliadoId) {
        this.afiliadoService.unAfiliadoCompleto(this.afiliadoId).subscribe({
          next: (afiliadoCompletoResponse: AfiliadoAdminResponse) => {
            if (afiliadoCompletoResponse.exito) {
              this.afiliado = afiliadoCompletoResponse.afiliado.comercio;
              this.afiliadoForm = this.formBuilder.group({
                cedulaJuridica: [
                  { value: this.afiliado.cedulaJuridica, disabled: true },
                  Validators.required,
                ],
                nombreComercio: [
                  this.afiliado.nombreComercio,
                  Validators.required,
                ],
                sinpeMovil: [this.afiliado.sinpeMovil, Validators.required],
                correo: [this.afiliado.correo, Validators.required],
                provincia: ['', Validators.required],
                canton: ['', Validators.required],
                distrito: ['', Validators.required],
                tipo: [this.afiliado.tipo, Validators.required],
                telefono_1: [
                  this.afiliado.telefonos[0],
                  [
                    Validators.required,
                    Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                  ],
                ],
                telefono_2: [
                  this.afiliado.telefonos[1]
                    ? this.afiliado.telefonos[1]
                    : null,
                  Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                ],
              });
            } else {
              alert('Error al obtener datos de afiliado.');
              this.router.navigate(['home']);
            }
          },
          error: (error) => {
            alert('Error al obtener datos de afiliado.');
            console.log(error);
            this.router.navigate(['home']);
          },
        });
      } else {
        this.router.navigate(['home']);
      }
    });
  }
  /**
   * Obteniendo lista de provincias al inicial el componente.
   * Revisa si hay parametros en el componente, de ser asi,
   * utiliza localidadService para cargar las listas de
   * cantones y provincias que corresponden a los parametros
   * para popular los selectores en el form cuando se quiere
   * editar un afiliado.
   */
  ngOnInit(): void {
    this.localidadService.ObtenerProvincias().subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_provincias = localidadesResponse.data;
        if (this.afiliadoId) {
          this.id_provincia = this.identificarProvincia(
            this.afiliado.provincia
          );
          this.afiliadoForm.value.provincia = this.id_provincia;
          this.localidadService.ObtenerCantones(this.id_provincia).subscribe({
            next: (localidadesResponse: LocalidadesResponse) => {
              this.lista_cantones = localidadesResponse.data;
              this.id_canton = this.identificarCanton(this.afiliado.canton);
              this.afiliadoForm.value.canton = this.id_canton;
              this.localidadService
                .ObtenerDistritos(this.id_provincia, this.id_canton)
                .subscribe({
                  next: (localidadesResponse: LocalidadesResponse) => {
                    this.lista_distritos = localidadesResponse.data;
                    this.id_distrito = this.identificarDistrito(
                      this.afiliado.distrito
                    );
                    this.afiliadoForm.value.distrito = this.id_distrito;
                    this.afiliadoForm.patchValue(this.afiliadoForm.value, {
                      onlySelf: false,
                      emitEvent: true,
                    });
                  },
                });
            },
          });
        }
      },
    });
  }

  /**
   * Obtiene el value del selector de provincia @param provincia,
   * guarda el nombre de la provincia localmente y procede a usar el
   * localidadService para obtener la lista de cantones correspondiente
   * a la provincia seleccionada por el usurio.
   */
  seleccionarProvincia(provincia: string): void {
    this.id_provincia = provincia;
    const index = Number(this.id_provincia) - 1;
    this.nombre_provincia = this.lista_provincias[index].nombre;
    this.localidadService.ObtenerCantones(this.id_provincia).subscribe({
      next: (localidadesResponse: LocalidadesResponse) => {
        this.lista_cantones = localidadesResponse.data;
      },
    });
  }

  /**
   * Obtiene el value del selector de canton @param canton,
   * guarda el nombre del canton localmente y procede a usar el
   * localidadService para obtener la lista de distritos correspondiente
   * al canton seleccionada por el usurio.
   */
  seleccionarCanton(canton: string): void {
    this.id_canton = canton;
    const index = Number(this.id_canton) - 1;
    this.nombre_canton = this.lista_cantones[index].nombre;
    this.localidadService
      .ObtenerDistritos(this.id_provincia, this.id_canton)
      .subscribe({
        next: (localidadesResponse: LocalidadesResponse) => {
          this.lista_distritos = localidadesResponse.data;
        },
      });
  }

  /**
   * Obtiene el value del selector de distrito @param distrito,
   * guarda el nombre del distrito localmente.
   */
  seleccionarDistrito(distrito: string): void {
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
  identificarProvincia(value: string): string {
    this.nombre_provincia = value;
    let numero: string = '';
    this.lista_provincias.forEach((element) => {
      if (element.nombre === value) {
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
  identificarCanton(value: string): string {
    this.nombre_canton = value;
    let numero: string = '';
    this.lista_cantones.forEach((element) => {
      if (element.nombre === value) {
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
  identificarDistrito(value: string): string {
    this.nombre_distrito = value;
    let numero: string = '';
    this.lista_distritos.forEach((element) => {
      if (element.nombre === value) {
        numero = element.numero.toString();
      }
    });
    return numero;
  }

  // Getter para acceder facilmente a los form fields
  get afiliadoFormControls() {
    return this.afiliadoForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.afiliadoForm.invalid) {
      return;
    }
    this.loading = true;
    this.afiliadoService
      .editarAfiliadoCompleto(this.formatoAfiliado(this.afiliadoForm.value))
      .subscribe({
        next: (afiliadoResponse: AfiliadoResponse) => {
          alert(afiliadoResponse.mensaje);
          this.router.navigate(['gestion-afiliados']);
          this.loading = false;
        },
        error: (error) => {
          alert(`Error al editar afiliado.`);
          console.log(error);
          this.loading = false;
          this.router.navigate(['gestion-afiliados']);
        },
      });
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar un afiliado
   * con el formato respectivo.
   * @param afiliadoFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Afiliado.
   */
  formatoAfiliado(afiliadoFormValues: any) {
    return {
      cedulaJuridica: this.afiliado.cedulaJuridica,
      nombreComercio: afiliadoFormValues.nombreComercio,
      sinpeMovil: afiliadoFormValues.sinpeMovil,
      correo: afiliadoFormValues.correo,
      provincia: this.nombre_provincia,
      canton: this.nombre_canton,
      distrito: this.nombre_distrito,
      comentarioSolicitud: '',
      tipo: afiliadoFormValues.tipo,
      telefonos: afiliadoFormValues.telefono_2
        ? [afiliadoFormValues.telefono_2, afiliadoFormValues.telefono_1]
        : [afiliadoFormValues.telefono_1],
    } as Afiliado;
  }
}
