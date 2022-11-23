export interface TiposComercioResponse {
    exito: boolean;
    tipos: TipoComercio[];
}

export interface TipoComercio {
    idTipo: string;
    nombreTipo:string;    
}


export interface TipoComercioResponse {
    actualizado: boolean;
    mensaje: string;
}