import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected options: any;

  constructor(
    protected loginService: LoginService,
    private router: Router) {
      this.options = [];
    }

  ngOnInit(): void {
    if (this.loginService.isAdminUby) {
      this.options = [
        {
          title: "Gestión de Empleados",
          icon: "fa-solid fa-user-gear",
          route: "gestion-empleados"
        },
        {
          title: "Gestión de Afiliados",
          icon: "fa-solid fa-store",
          route: "gestion-afiliados"
        },
        {
          title: "Gestión de Administradores",
          icon: "fa-solid fa-id-card",
          route: "gestion-admins-uby"
        },
        {
          title: "Administración de Afiliaciones",
          icon: "fa-solid fa-file-circle-plus",
          route: "administracion-afiliaciones"
        },
        {
          title: "Gestión de Tipos Comercio",
          icon: "fa-solid fa-boxes-stacked",
          route: "gestion-tipos-comercio"
        },
        {
          title: "Gestión de Repartidores",
          icon: "fa-solid fa-motorcycle",
          route: "gestion-repartidores"
        },
        {
          title: "Reportes",
          icon: "fa-solid fa-file-pdf",
          route: "reportes"
        },
      ]; 
    } else if (this.loginService.isAdminAfiliado) {
      this.options =  [
        {
          title: "Mis datos",
          icon: "fa-solid fa-store",
          route: ""
        },
      ];
    } else {
      this.options =  [
        {
          title: "Mis datos",
          icon: "fa-solid fa-user",
          route: "mis-datos"
        },
      ];
    }
  }

  protected goTo(route: string): void {
    this.router.navigate([route]);
  }

}
