import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RepartidoresService } from '../services/repartidores/repartidores.service';
import {
    RepartidoresResponse,
    RepartidorResponse,
    Repartidor
} from '../services/repartidores/repartidores.types'

@Component({
  selector: 'app-gestion-repartidores',
  templateUrl: './gestion-repartidores.component.html',
  styleUrls: ['./gestion-repartidores.component.css']
})
export class GestionRepartidoresComponent implements OnInit {
  protected repartidores: Repartidor[] = [];

  constructor(
    private repartidoresService: RepartidoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ObtenerRepartidores();
  }
  /**
   * Esta función llama al servicio de admins-uby, obtiene todos los repartidores de la base de datos
   * y actualiza la lista de repartidores del componente.
   */
   protected ObtenerRepartidores(): void {
    this.repartidoresService.todosRepartidores().subscribe({
      next: (repartidoresResponse: RepartidoresResponse) => {
        if (repartidoresResponse.exito) {
          this.repartidores = repartidoresResponse.repartidores.sort(
            (repartidorA,repartidorB) => {
              return repartidorA.nombre.localeCompare(
                repartidorB.nombre
              );
            }
          );
        } else {
          alert('Error al obtener Repartidores.');
        }
      },
      error: (error) => {
        alert('Error al obtener Repartidores.');
        console.log(error);
      },
    });
  }
    /**
   * Esta función es para dar un formato al nombre completo del repartidor a partir de varios atributos.
   * @param usuarioRepart El repartidor del que se quiere obtener el nombre completo.
   * @returns Nombre completo del repartidor: string.
   */
     protected nombreCompleto(repartidor: Repartidor): string {
      return `${repartidor.nombre} ${repartidor.primerApellido} ${repartidor.segundoApellido}`;
    }
     protected isDisponible(repartidor:Repartidor): string{
      if (repartidor.disponible == true){
        return "Si"
      }
      else{
        return "No"
      }
     }
   /**
   * Función para navegar a la pantalla de crear repartidor.
   */
    protected crearRepartidor() {
      this.router.navigate(['repartidor']);
    }

    protected editarRepartidor(repartidor: Repartidor) {
      this.router.navigate(['repartidor'], {state: repartidor});
    }
  /**
   * Función para borrar un repartidor haciendo uso del servicio de gestion-repartidores.
   * @param idProducto cedula del repartidor que se quiere eliminar.
   */
   protected borrarRepartidor(id: string) {
    this.repartidoresService.borrarRepartidor(id).subscribe({
      next: (repartidorResponse: RepartidorResponse ) => {
        alert(repartidorResponse.mensaje);
        this.ObtenerRepartidores()
      },
      error: (error) => {
        alert(`Error al eliminar repartidor.`);
        console.log(error);
      },
    });
  }



}