export interface RepartidoresResponse {
    exito: boolean;
    repartidores: Repartidor[];
}

export interface Repartidor {
    usuarioRepart: string;
    nombre:string;
    primerApellido:string;
    segundoApellido: string;
    correoRepart: string;
    passwordRepart: string;
    provincia: string;
    canton: string;
    distrito: string;
    telefonos: String[];
    disponible: boolean;
}


export interface RepartidorResponse {
    actualizado: boolean;
    mensaje: string;
}