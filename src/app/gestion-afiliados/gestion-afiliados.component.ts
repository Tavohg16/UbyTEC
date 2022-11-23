import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AfiliadoAdmin } from '../services/afiliado-admin/afiliado-admin.types';
import { AfiliadoService } from '../services/afiliado/afiliado.service';
import {
  Afiliado,
  AfiliadoCompleto,
  AfiliadoResponse,
  AfiliadosAdminsResponse,
} from '../services/afiliado/afiliado.types';
import {
  TipoComercio,
  TipoComercioResponse,
  TiposComercioResponse,
} from '../services/tipos-comercio/tipo-comercio.types';
import { TiposComercioService } from '../services/tipos-comercio/tipos-comercio.service';

@Component({
  selector: 'app-gestion-afiliados',
  templateUrl: './gestion-afiliados.component.html',
  styleUrls: ['./gestion-afiliados.component.css'],
})
export class GestionAfiliadosComponent implements OnInit {
  protected afiliadosCompletos: AfiliadoCompleto[] = [];
  protected tiposComercio: TipoComercio[] = [];

  constructor(
    private afiliadoService: AfiliadoService,
    private tiposComercioService: TiposComercioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerTiposComercio();
    this.obtenerAfiliadosCompletos();
  }

  protected obtenerTiposComercio(): void {
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
  }

  /**
   * Esta función llama al servicio de afiliados, obtiene todos los afiliado de la base de datos
   * y actualiza la lista de afiliados del componente.
   */
  protected obtenerAfiliadosCompletos(): void {
    this.afiliadoService.todosAfiliadosCompletos().subscribe({
      next: (afiliadoResponse: AfiliadosAdminsResponse) => {
        if (afiliadoResponse.exito) {
          this.afiliadosCompletos = afiliadoResponse.afiliados.sort(
            (afiliadoA, afiliadoB) => {
              return afiliadoA.comercio.nombreComercio.localeCompare(
                afiliadoB.comercio.nombreComercio
              );
            }
          );
        } else {
          alert('Error al obtener afiliados completos.');
        }
      },
      error: (error) => {
        alert('Error al obtener afiliados completos.');
        console.log(error);
      },
    });
  }
  /**
   * Esta función es para dar un formato al nombre completo del admin del afiliado a partir de varios atributos.
   * @param afiliadoCompleto El admin de afiliado del que se quiere obtener el nombre completo.
   * @returns Nombre completo del admin de afiliado: string.
   */
  protected nombreCompletoAdmin(afiliadoCompleto: AfiliadoCompleto): string {
    return `${afiliadoCompleto.administrador.nombre} ${afiliadoCompleto.administrador.primerApellido} ${afiliadoCompleto.administrador.segundoApellido}`;
  }

  asociarTipoComercio(tipoComercio: number) {
    return this.tiposComercio?.find(
      (tipo: TipoComercio) => +tipo.idTipo === tipoComercio
    )?.nombreTipo;
  }

  /**
   * Función para navegar a la pantalla de crear afiliado.
   */
  protected crearAfiliado() {
    this.router.navigate(['afiliado']);
  }

  protected editarAfiliado(afiliado: Afiliado) {
    this.router.navigate(['editar-afiliado', afiliado.cedulaJuridica]);
  }

  protected editarAdministrador(administrador: AfiliadoAdmin) {
    this.router.navigate(['editar-administrador', administrador.usuarioAdminAfi]);
  }

  /**
   * Función para reemplazar un administrador de afiliado haciendo uso del servicio de afiliado admin.
   * @param id cedula juridica del afiliado del que se quiere reemplazar el admin.
   */
  protected reemplazarAdministrador(id: string) {
    this.router.navigate(['reemplazar-admin-afiliado', id]);
  }
}
