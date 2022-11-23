import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AfiliadosAdminsResponse,
  AfiliadoAdminResponse,
  AfiliadoCompleto,
  AfiliadoResponse,
  Afiliado,
} from './afiliado.types';

@Injectable({
  providedIn: 'root',
})
export class AfiliadoService {
  // Definiendo ruta a la que se hara los request http relacionados a los afiliados UbyTEC
  private AfiliadosUrl: string = `${environment.apiUrl}/manage/afiliado`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    }),
  };

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Metodo para obtener la lista de todos los afiliados completos de UbyTEC.
   * @returns observable del query: Observable<AfiliadosAdminsResponse[]>.
   */
  todosAfiliadosCompletos() {
    return this.http.get<AfiliadosAdminsResponse>(
      `${this.AfiliadosUrl}`,
      this.httpOptions
    );
  }

  /**
   * Metodo para obtener un afiliado completo de UbyTEC.
   * @returns observable del query: Observable<AfiliadoAdminResponse[]>.
   */
  unAfiliadoCompleto(cedulaJuridica: string) {
    return this.http.get<AfiliadoAdminResponse>(
      `${this.AfiliadosUrl}/${cedulaJuridica}`,
      this.httpOptions
    );
  }
  /**
   * Metodo crear un afiliado UbyTEC.
   * @returns observable del query: Observable<AfiliadoResponse[]>.
   */
  crearAfiliadoCompleto(afiliado: AfiliadoCompleto) {
    const body = JSON.stringify(afiliado);
    return this.http.post<AfiliadoResponse>(
      this.AfiliadosUrl,
      body,
      this.httpOptions
    );
  }

  /**
   * Metodo editar un afiliado UbyTEC.
   * @returns observable del query: Observable<AfiliadoResponse[]>.
   */
  editarAfiliadoCompleto(afiliado: Afiliado) {
    const body = JSON.stringify(afiliado);
    return this.http.patch<AfiliadoResponse>(
      this.AfiliadosUrl,
      body,
      this.httpOptions
    );
  }

  /**
   * Metodo borrar un afiliado.
   * @returns observable del query: Observable<AfiliadoResponse[]>.
   */
   borrarAfiliado(id: string) {
    const body = JSON.stringify({id});
    return this.http.delete<AfiliadoResponse>(
      this.AfiliadosUrl,
      {...this.httpOptions, body }
    );
  }
}
