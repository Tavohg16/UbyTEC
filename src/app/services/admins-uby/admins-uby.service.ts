import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AdminsUbyResponse,
  AdminUbyResponse,
  AdminUby
} from './admins-uby.types'

@Injectable({
  providedIn: 'root'
})
export class AdminsUbyService {
  // Definiendo ruta a la que se hara los request http relacionados a los administradores UbyTEC
  private AdminsUbyUrl: string = `${environment.apiUrl}/manage/UbyAdmin`;

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
   todosAdminsUby() {
    return this.http.get<AdminsUbyResponse>(
      `${this.AdminsUbyUrl}`,
      this.httpOptions
    );
  }
  /**
   * Metodo crear un administrador UbyTEC.
   * @returns observable del query: Observable<AdminUbyResponse[]>.
   */
     crearAdminUby(adminUby: AdminUby) {
      const body = JSON.stringify(adminUby);
      return this.http.post<AdminUbyResponse>(
        this.AdminsUbyUrl,
        body,
        this.httpOptions
      );
    }
  
    /**
     * Metodo editar un administrador UbyTEC.
     * @returns observable del query: Observable<AdminUbyResponse[]>.
     */
    editarAdminUby(adminUby: AdminUby) {
      const body = JSON.stringify(adminUby);
      return this.http.patch<AdminUbyResponse>(
        this.AdminsUbyUrl,
        body,
        this.httpOptions
      );
    }

  /**
   * Metodo borrar un administrador UbyTEC.
   * @returns observable del query: Observable<AdminsUbyResponse[]>.
   */
   borrarAdminUby(id: string) {
    const body = JSON.stringify({id});
    return this.http.delete<AdminUbyResponse>(
      this.AdminsUbyUrl,
      {...this.httpOptions, body }
    );
  }
}