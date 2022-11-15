export interface AdminsUbyResponse {
    exito: boolean;
    admin: AdminUby[];
}

export interface AdminUby {
    cedulaAdminUby: string;
    nombre:string;
    primerApellido:string;
    segundoApellido: string;
    correoElectronico: string;
    usuarioAdminUby: string;
    passwordAdminUby: string;
    provincia: string;
    canton: string;
    distrito: string;
    adminUbyTelefonos: datosTelAdminUby[];
}

export interface datosTelAdminUby {
    id: number;
    cedulaAdminUby: string;
    telefono: string;
    cedulaAdminUbyNavigation: null;


}

export interface AdminUbyResponse {
    actualizado: boolean;
    mensaje: string;
}