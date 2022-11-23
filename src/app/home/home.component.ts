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
          route: "gestion-admins-uby"
        },
        {
          title: "Gestión de Afiliados",
          icon: "fa-solid fa-store",
          route: "gestion-afiliados"
        },
        {
          title: "Gestión de Repartidores",
          icon: "fa-solid fa-motorcycle",
          route: "gestion-repartidores"
        }
      ]; 
    } else if (this.loginService.isAdminAfiliado) {
      this.options =  [
        {
          title: "Mis datos",
          icon: "fa-solid fa-store",
          route: ""
        },
        {
          title: "Reemplazarme",
          icon: "fa-solid fa-circle-xmark",
          route: "reemplazar-admin-afiliado/0"
        },
        {
          title: "Gestión de Productos",
          icon: "fa-solid fa-id-card",
          route: "gestion-productos"
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
