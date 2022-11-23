import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AfiliadoAdminService } from '../services/afiliado-admin/afiliado-admin.service';
import {
  AfiliadoAdminResponseAAS,
  AfiliadoAdminReemplazo,
  AfiliadoAdmin,
} from '../services/afiliado-admin/afiliado-admin.types';
import { AfiliadoService } from '../services/afiliado/afiliado.service';
import { AfiliadoAdminResponse } from '../services/afiliado/afiliado.types';
import { LocalizacionService } from '../services/localizacion/localizacion.service';
import {
  Localidad,
  LocalidadesResponse,
} from '../services/localizacion/localizacion.types';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-editar-administrador',
  templateUrl: './editar-administrador.component.html',
  styleUrls: ['./editar-administrador.component.css'],
})
export class EditarAdministradorComponent implements OnInit {
  // Definiendo variables a utilizar
  protected adminId: any;
  protected admin: any;
  protected title: string = 'Editar administrador';
  protected lista_provincias: Localidad[] = [];
  protected lista_cantones: Localidad[] = [];
  protected lista_distritos: Localidad[] = [];
  protected id_provincia: string = '';
  protected nombre_provincia: string = '';
  protected id_canton: string = '';
  protected nombre_canton: string = '';
  protected id_distrito: string = '';
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
      this.adminId = paramMap.get('id');
      if (this.adminId) {
        // Obteniendo cedula juridica afiliado
        this.afiliadoService.cedulaAfiliadoUsuario(this.adminId).subscribe({
          next: (cedulaAfiliadoResponse: any) => {
            if (cedulaAfiliadoResponse.id) {
              this.afiliadoService
                .unAfiliadoCompleto(cedulaAfiliadoResponse.id)
                .subscribe({
                  next: (afiliadoCompletoResponse: AfiliadoAdminResponse) => {
                    if (afiliadoCompletoResponse.exito) {
                      this.admin =
                        afiliadoCompletoResponse.afiliado.administrador;
                      this.adminForm = this.formBuilder.group({
                        nombre: [this.admin.nombre, Validators.required],
                        primerApellido: [
                          this.admin.primerApellido,
                          Validators.required,
                        ],
                        segundoApellido: [
                          this.admin.segundoApellido,
                          Validators.required,
                        ],
                        correoElectronico: [
                          this.admin.correoElectronico,
                          Validators.required,
                        ],
                        usuarioAdminAfi: [
                          { value: this.admin.usuarioAdminAfi, disabled: true },
                          Validators.required,
                        ],
                        passwordAdminAfi: [
                          this.admin.passwordAdminAfi,
                          Validators.required,
                        ],
                        provincia: ['', Validators.required],
                        canton: ['', Validators.required],
                        distrito: ['', Validators.required],
                        telefono_1: [
                          this.admin.telefonos[0],
                          [
                            Validators.required,
                            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                          ],
                        ],
                        telefono_2: [
                          this.admin.telefonos[1]
                            ? this.admin.telefonos[1]
                            : null,
                          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                        ],
                      });
                      this.localidadService.ObtenerProvincias().subscribe({
                        next: (localidadesResponse: LocalidadesResponse) => {
                          this.lista_provincias = localidadesResponse.data;
                          if (this.adminId) {
                            this.id_provincia = this.identificarProvincia(
                              this.admin.provincia
                            );
                            this.adminForm.value.provincia = this.id_provincia;
                            this.localidadService
                              .ObtenerCantones(this.id_provincia)
                              .subscribe({
                                next: (
                                  localidadesResponse: LocalidadesResponse
                                ) => {
                                  this.lista_cantones =
                                    localidadesResponse.data;
                                  this.id_canton = this.identificarCanton(
                                    this.admin.canton
                                  );
                                  this.adminForm.value.canton = this.id_canton;
                                  this.localidadService
                                    .ObtenerDistritos(
                                      this.id_provincia,
                                      this.id_canton
                                    )
                                    .subscribe({
                                      next: (
                                        localidadesResponse: LocalidadesResponse
                                      ) => {
                                        this.lista_distritos =
                                          localidadesResponse.data;
                                        this.id_distrito =
                                          this.identificarDistrito(
                                            this.admin.distrito
                                          );
                                        this.adminForm.value.distrito =
                                          this.id_distrito;
                                        this.adminForm.patchValue(
                                          this.adminForm.value,
                                          {
                                            onlySelf: false,
                                            emitEvent: true,
                                          }
                                        );
                                      },
                                    });
                                },
                              });
                          }
                        },
                      });
                    } else {
                      alert('Error al obtener datos de administrador.');
                      this.router.navigate(['home']);
                    }
                  },
                  error: (error) => {
                    alert('Error al obtener datos de administrador.');
                    console.log(error);
                    this.router.navigate(['home']);
                  },
                });
            } else {
              alert('Error al obtener cedula juridica de afiliado.');
            }
          },
          error: (error) => {
            alert('Error al obtener cedula juridica de afiliado.');
            console.log(error);
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
   * editar un administrador.
   */
  ngOnInit(): void {}

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
      .editarAfiliadoAdmin(this.formatoAfiliado(this.adminForm.value))
      .subscribe({
        next: (afiliadoResponse: AfiliadoAdminResponseAAS) => {
          alert(afiliadoResponse.mensaje);
          this.router.navigate(['home']);
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
   * Función para armar el body que se va a enviar al servidor para actualizar un administrador
   * con el formato respectivo.
   * @param adminFormValues Los valores que ingresó el usuario al formulario.
   * @returns Un objeto que tiene el formato correcto para enviarlo al servidor: AfiliadoAdmin.
   */
  formatoAfiliado(adminFormValues: any) {
    return {
      nombre: adminFormValues.nombre,
      primerApellido: adminFormValues.primerApellido,
      segundoApellido: adminFormValues.segundoApellido,
      correoElectronico: adminFormValues.correoElectronico,
      usuarioAdminAfi: this.admin.usuarioAdminAfi,
      passwordAdminAfi: adminFormValues.passwordAdminAfi,
      provincia: this.nombre_provincia,
      canton: this.nombre_canton,
      distrito: this.nombre_distrito,
      activo: true,
      telefonos: adminFormValues.telefono_2
        ? [adminFormValues.telefono_2, adminFormValues.telefono_1]
        : [adminFormValues.telefono_1],
    } as AfiliadoAdmin;
  }
}
