import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { HomeComponent } from './home/home.component';
import {GestionAdminsUbyComponent} from './gestion-admins-uby/gestion-admins-uby.component';
import { AdminUbyComponent } from './admin-uby/admin-uby.component';
import { GestionRepartidoresComponent } from './gestion-repartidores/gestion-repartidores.component';
import { RepartidorComponent } from './repartidor/repartidor.component';
import { GestionProductosComponent } from './gestion-productos/gestion-productos.component';
import { ProductoComponent } from './producto/producto.component';
import { GestionAfiliadosComponent } from './gestion-afiliados/gestion-afiliados.component';
import { EditarAfiliadoComponent } from './editar-afiliado/editar-afiliado.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GestionAdminsUbyComponent,
    AdminUbyComponent,
    GestionRepartidoresComponent,
    RepartidorComponent,
    GestionProductosComponent,
    ProductoComponent,
    GestionAfiliadosComponent,
    EditarAfiliadoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
