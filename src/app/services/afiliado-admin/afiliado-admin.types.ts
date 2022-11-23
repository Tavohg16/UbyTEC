export interface AfiliadoAdmin {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  usuarioAdminAfi: string;
  passwordAdminAfi: string;
  provincia: string;
  canton: string;
  distrito: string;
  activo: true;
  telefonos: string[];
}

export interface AfiliadoAdminReemplazo {
  cedulaJuridica: string;
  usuarioAnterior: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  usuarioAdminAfi: string;
  passwordAdminAfi: string;
  provincia: string;
  canton: string;
  distrito: string;
  activo: boolean;
  telefonos: string[];
}

export interface AfiliadoAdminResponseAAS {
  actualizado: boolean;
  mensaje: string;
}
