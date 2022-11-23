import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalizacionService } from '../services/localizacion/localizacion.service';
import {
  Localidad,
  LocalidadesResponse,
} from '../services/localizacion/localizacion.types';
import { AfiliadoAdminService } from '../services/afiliado-admin/afiliado-admin.service';
import { AfiliadoService } from '../services/afiliado/afiliado.service';
import { LoginService } from '../services/login/login.service';
import { AfiliadoAdminResponse } from '../services/afiliado/afiliado.types';
import {
  AfiliadoAdminReemplazo,
  AfiliadoAdminResponseAAS,
} from '../services/afiliado-admin/afiliado-admin.types';

@Component({
  selector: 'app-reemplazar-admin-afiliado',
  templateUrl: './reemplazar-admin-afiliado.component.html',
  styleUrls: ['./reemplazar-admin-afiliado.component.css'],
})
export class ReemplazarAdminAfiliadoComponent implements OnInit {
  // Definiendo variables a utilizar
  protected afiliadoId: any;
  protected cedParam: any;
  protected afiliado: any;
  protected title: string = 'Reemplazar administrador';
  protected replaceFrom: string = 'ubyAdmin';
  protected lista_provincias: Localidad[] = [];
  protected lista_cantones: Localidad[] = [];
  protected lista_distritos: Localidad[] = [];
  protected id_provincia: string = '0';
  protected nombre_provincia: string = '';
  protected id_canton: string = '0';
  protected nombre_canton: string = '';
  protected id_distrito: string = '0';
  protected nombre_distrito: string = '';
  protected adminForm: FormGroup;
  protected loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localidadService: LocalizacionService,
    private afiliadoService: AfiliadoService,
    private afiliadoAdminService: AfiliadoAdminService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService
  ) {
    this.adminForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      primerApellido: [null, Validators.required],
      segundoApellido: [null, Validators.required],
      correoElectronico: [null, Validators.required],
      usuarioAdminAfi: [null, Validators.required],
      passwordAdminAfi: [null, Validators.required],
      provincia: [null, Validators.required],
      canton: [null, Validators.required],
      distrito: [null, Validators.required],
      telefono_1: [
        null,
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      telefono_2: [null, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
    });

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.cedParam = paramMap.get('id');
      this.afiliadoId = paramMap.get('id');
      if (this.afiliadoId !== "0") {
        this.obtenerAfiliado();
      } else {
        // Obteniendo cedula juridica afiliado
        this.afiliadoService
          .cedulaAfiliadoUsuario(
            this.loginService.idLogin ? this.loginService.idLogin : ''
          )
          .subscribe({
            next: (cedulaAfiliadoResponse: any) => {
              if (cedulaAfiliadoResponse.id) {
                this.afiliadoId = cedulaAfiliadoResponse.id;
                this.obtenerAfiliado();
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
        this.localidadService.ObtenerCantones(this.id_provincia).subscribe({
          next: (localidadesResponse: LocalidadesResponse) => {
            this.lista_cantones = localidadesResponse.data;
            this.localidadService
              .ObtenerDistritos(this.id_provincia, this.id_canton)
              .subscribe({
                next: (localidadesResponse: LocalidadesResponse) => {
                  this.lista_distritos = localidadesResponse.data;
                  this.adminForm.patchValue(this.adminForm.value, {
                    onlySelf: false,
                    emitEvent: true,
                  });
                },
              });
          },
        });
      },
    });
  }

  protected obtenerAfiliado() {
    this.afiliadoService.unAfiliadoCompleto(this.afiliadoId).subscribe({
      next: (afiliadoCompletoResponse: AfiliadoAdminResponse) => {
        if (afiliadoCompletoResponse.exito) {
          this.afiliado = afiliadoCompletoResponse.afiliado;
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
  get adminFormControls() {
    return this.adminForm.controls;
  }

  onSubmit() {
    // Caso en el que el form es inválido
    if (this.adminForm.invalid) {
      return;
    }
    this.loading = true;
    this.afiliadoAdminService
      .reemplazarAfiliadoAdmin(this.formatoAfiliado(this.adminForm.value))
      .subscribe({
        next: (afiliadoResponse: AfiliadoAdminResponseAAS) => {
          alert(afiliadoResponse.mensaje);
          if (this.cedParam !== "0") {
            this.router.navigate(['gestion-afiliados']);
          } else {
            this.loginService.logout();
          }
          this.loading = false;
        },
        error: (error) => {
          alert(`Error al reemplazar administrador.`);
          console.log(error);
          this.loading = false;
          this.router.navigate(['home']);
        },
      });
  }

  /**
   * Función para armar el body que se va a enviar al servidor para actualizar un afiliado
   * con el formato respectivo.
   * @param adminFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: Afiliado.
   */
  formatoAfiliado(adminFormValues: any) {
    return {
      cedulaJuridica: this.afiliado.comercio.cedulaJuridica,
      usuarioAnterior: this.afiliado.administrador.usuarioAdminAfi,
      nombre: adminFormValues.nombre,
      primerApellido: adminFormValues.primerApellido,
      segundoApellido: adminFormValues.segundoApellido,
      correoElectronico: adminFormValues.correoElectronico,
      usuarioAdminAfi: adminFormValues.usuarioAdminAfi,
      passwordAdminAfi: adminFormValues.passwordAdminAfi,
      provincia: this.nombre_provincia,
      canton: this.nombre_canton,
      distrito: this.nombre_distrito,
      activo: true,
      telefonos: adminFormValues.telefono_2
        ? [adminFormValues.telefono_2, adminFormValues.telefono_1]
        : [adminFormValues.telefono_1],
    } as AfiliadoAdminReemplazo;
  }
}
