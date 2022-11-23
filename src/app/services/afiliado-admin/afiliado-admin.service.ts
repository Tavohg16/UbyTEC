import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AfiliadoAdmin,
  AfiliadoAdminResponseAAS,
  AfiliadoAdminReemplazo,
} from './afiliado-admin.types';

@Injectable({
  providedIn: 'root',
})
export class AfiliadoAdminService {
  // Definiendo ruta a la que se hara los request http relacionados a los administradores de afiliados UbyTEC
  private AfiliadosAdminsUrl: string = `${environment.apiUrl}/manage/afiliado/afiadmin`;

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
   * Metodo editar un administrador de afiliado UbyTEC.
   * @returns observable del query: Observable<AfiliadoAdminResponse[]>.
   */
  editarAfiliadoAdmin(afiliadoAdmin: AfiliadoAdmin) {
    const body = JSON.stringify(afiliadoAdmin);
    return this.http.patch<AfiliadoAdminResponseAAS>(
      this.AfiliadosAdminsUrl,
      body,
      this.httpOptions
    );
  }

  /**
   * Metodo reemplazar un administrador de afiliado UbyTEC.
   * @returns observable del query: Observable<AfiliadoAdminResponse[]>.
   */
  reemplazarAfiliadoAdmin(afiliadoAdmin: AfiliadoAdminReemplazo) {
    const body = JSON.stringify(afiliadoAdmin);
    return this.http.post<AfiliadoAdminResponseAAS>(
      `${this.AfiliadosAdminsUrl}/replace`,
      body,
      this.httpOptions
    );
  }
}
