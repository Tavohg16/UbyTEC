import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AdminsUbyService } from '../services/admins-uby/admins-uby.service';
import {
    AdminsUbyResponse,
    AdminUbyResponse,
    AdminUby
} from '../services/admins-uby/admins-uby.types'

@Component({
  selector: 'app-gestion-admins-uby',
  templateUrl: './gestion-admins-uby.component.html',
  styleUrls: ['./gestion-admins-uby.component.css']
})
export class GestionAdminsUbyComponent implements OnInit {
  protected adminsUby: AdminUby[] = [];

  constructor(
    private adminsUbyService: AdminsUbyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ObtenerAdminsUby();
  }
  /**
   * Esta función llama al servicio de admins-uby, obtiene todos los administradores UbyTEC de la base de datos
   * y actualiza la lista de administradores UbyTEC del componente.
   */
   protected ObtenerAdminsUby(): void {
    this.adminsUbyService.todosAdminsUby().subscribe({
      next: (adminsUbyResponse: AdminsUbyResponse) => {
        if (adminsUbyResponse.exito) {
          this.adminsUby = adminsUbyResponse.admin.sort(
            (adminUbyA,adminUbyB) => {
              return adminUbyA.nombre.localeCompare(
                adminUbyB.nombre
              );
            }
          );
          console.log(this.adminsUby)
        } else {
          alert('Error al obtener Administradores UbyTEC.');
        }
      },
      error: (error) => {
        alert('Error al obtener Administradores UbyTEC.');
        console.log(error);
      },
    });
  }
    /**
   * Esta función es para dar un formato al nombre completo del administrador UbyTEC a partir de varios atributos.
   * @param adminUby El administrador UbyTEC del que se quiere obtener el nombre completo.
   * @returns Nombre completo del administrador UbyTEC: string.
   */
     protected nombreCompleto(adminUby: AdminUby): string {
      return `${adminUby.nombre} ${adminUby.primerApellido} ${adminUby.segundoApellido}`;
    }
  /**
   * Función para borrar un administrador UbyTEC haciendo uso del servicio de admins-uby.
   * @param cedula_admin_uby cedula del administrador UbyTEC que se quiere eliminar.
   */
   protected borrarAdminUby(cedula_admin_uby: string) {
    this.adminsUbyService.borrarAdminUby(cedula_admin_uby).subscribe({
      next: (adminUbyResponse: AdminUbyResponse ) => {
        alert(adminUbyResponse.mensaje);
        this.ObtenerAdminsUby()
      },
      error: (error) => {
        alert(`Error al eliminar administrador UbyTEC.`);
        console.log(error);
      },
    });
  }



}