import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TiposComercioResponse, TipoComercio, TipoComercioResponse } from './tipo-comercio.types';

@Injectable({
  providedIn: 'root'
})
export class TiposComercioService {

  // Definiendo ruta a la que se hara los request http relacionados a los tipos de comercio
  private TipoComercioUrl: string = `${environment.apiUrl}/manage/tipocomercio`;

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
   * Metodo para obtener la lista de todos los tipos de comercio.
   * @returns observable del query: Observable<TipoComercioResponse>.
   */
   todosTiposComercio() {
    return this.http.get<TiposComercioResponse>(
      `${this.TipoComercioUrl}`,
      this.httpOptions
    );
  }
    /**
   * Metodo crear un tipo de comercio.
   * @returns observable del query: Observable<TipoComercioResponse>.
   */
     crearTipoComercio(tipoComercio: TipoComercio) {
      const body = JSON.stringify(tipoComercio);
      return this.http.post<TipoComercioResponse>(
        this.TipoComercioUrl,
        body,
        this.httpOptions
      );
    }

    /**
     * Metodo editar un tipo de comercio.
     * @returns observable del query: Observable<TipoComercioResponse>.
     */
    editarTipoComercio(tipoComercio: TipoComercio) {
      const body = JSON.stringify(tipoComercio);
      return this.http.patch<TipoComercioResponse>(
        this.TipoComercioUrl,
        body,
        this.httpOptions
      );
    }

  /**
   * Metodo borrar un tipo de comercio.
   * @returns observable del query: Observable<TipoComercioResponse>.
   */
   borrarTipoComercio(id: string) {
    const body = JSON.stringify({id});
    return this.http.delete<TipoComercioResponse>(
      this.TipoComercioUrl,
      {...this.httpOptions, body }
    );
  }
}
