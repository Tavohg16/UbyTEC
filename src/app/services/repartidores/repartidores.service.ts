import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  RepartidoresResponse,
  RepartidorResponse,
  Repartidor
} from './repartidores.types'

@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {
  // Definiendo ruta a la que se hara los request http relacionados a los repartidores
  private RepartidoresUrl: string = `${environment.apiUrl}/manage/repartidor`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    })
  }

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Metodo para obtener la lista de todos los repartidores.
   * @returns observable del query: Observable<RepartidoresResponse[]>.
   */
   todosRepartidores() {
    return this.http.get<RepartidoresResponse>(
      `${this.RepartidoresUrl}`,
      this.httpOptions
    );
  }
    /**
   * Metodo crear un repartidor.
   * @returns observable del query: Observable<RepartidorResponse[]>.
   */
     crearRepartidor(repartidor: Repartidor) {
      const body = JSON.stringify(repartidor);
      return this.http.post<RepartidorResponse>(
        this.RepartidoresUrl,
        body,
        this.httpOptions
      );
    }

    /**
     * Metodo editar un Repartidor.
     * @returns observable del query: Observable<RepartidorResponse[]>.
     */
    editarRepartidor(repartidor: Repartidor) {
      const body = JSON.stringify(repartidor);
      return this.http.patch<RepartidorResponse>(
        this.RepartidoresUrl,
        body,
        this.httpOptions
      );
    }

  /**
   * Metodo borrar un repartidor.
   * @returns observable del query: Observable<RepartidoresResponse[]>.
   */
   borrarRepartidor(id: string) {
    const body = JSON.stringify({id});
    return this.http.delete<RepartidorResponse>(
      this.RepartidoresUrl,
      {...this.httpOptions, body }
    );
  }
}