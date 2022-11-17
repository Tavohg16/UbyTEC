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
  // Definiendo ruta a la que se hara los request http relacionados a los administradores UbyTEC
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
   * Metodo para obtener la lista de todos los administradores UbyTEC.
   * @returns observable del query: Observable<AdminsUbyResponse[]>.
   */
   todosRepartidores() {
    return this.http.get<RepartidoresResponse>(
      `${this.RepartidoresUrl}`,
      this.httpOptions
    );
  }

  /**
   * Metodo borrar un administrador UbyTEC.
   * @returns observable del query: Observable<AdminsUbyResponse[]>.
   */
   borrarRepartidor(id: string) {
    const body = JSON.stringify({id});
    return this.http.delete<RepartidorResponse>(
      this.RepartidoresUrl,
      {...this.httpOptions, body }
    );
  }
}