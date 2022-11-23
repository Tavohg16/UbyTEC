import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GestionAdminsUbyComponent } from './gestion-admins-uby/gestion-admins-uby.component';
import { AdminUbyComponent } from './admin-uby/admin-uby.component';
import { GestionRepartidoresComponent } from './gestion-repartidores/gestion-repartidores.component';
import { RepartidorComponent } from './repartidor/repartidor.component';
import { GestionProductosComponent } from './gestion-productos/gestion-productos.component';
import { ProductoComponent } from './producto/producto.component';
import { GestionAfiliadosComponent } from './gestion-afiliados/gestion-afiliados.component';
import { EditarAfiliadoComponent } from './editar-afiliado/editar-afiliado.component';
import { ReemplazarAdminAfiliadoComponent } from './reemplazar-admin-afiliado/reemplazar-admin-afiliado.component';
import { EditarAdministradorComponent } from './editar-administrador/editar-administrador.component';
/**
 * Definiendo rutas a componentes
 */
const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'gestion-admins-uby', component: GestionAdminsUbyComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'admin-uby', component: AdminUbyComponent ,  pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'gestion-afiliados', component: GestionAfiliadosComponent ,  pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'editar-afiliado/:id', component: EditarAfiliadoComponent ,  pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'gestion-repartidores', component: GestionRepartidoresComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'repartidor', component: RepartidorComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'gestion-productos', component: GestionProductosComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'producto', component: ProductoComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'reemplazar-admin-afiliado/:id', component: ReemplazarAdminAfiliadoComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'editar-administrador/:id', component: EditarAdministradorComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
