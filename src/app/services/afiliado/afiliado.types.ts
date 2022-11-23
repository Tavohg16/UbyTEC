import { AfiliadoAdmin } from '../afiliado-admin/afiliado-admin.types';

export interface AfiliadoResponse {
  actualizado: boolean;
  mensaje: string;
}

export interface Afiliado {
  cedulaJuridica: string;
  nombreComercio: string;
  sinpeMovil: string;
  correo: string;
  provincia: string;
  canton: string;
  distrito: string;
  comentarioSolicitud: string;
  tipo: number;
  telefonos: string[];
}

export interface AfiliadoCompleto {
  comercio: Afiliado;
  administrador: AfiliadoAdmin;
}

export interface AfiliadosAdminsResponse {
  exito: boolean;
  afiliados: AfiliadoCompleto[];
}

export interface AfiliadoAdminResponse {
  exito: boolean;
  afiliado: AfiliadoCompleto;
}
