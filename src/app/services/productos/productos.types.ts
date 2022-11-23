export interface ProductosResponse {
    exito: boolean;
    productos: Producto[];
}

export interface Producto {
    idProducto: number;
    nombreProducto:string;
    urlFoto:string;
    precio: string;
    cedulaJuridica: string;
    idCategoria: number;
    nombreCategoria?: string;
}

export interface Categoria{
    idCategoria: number;
    nombreCategoria: string;
}

export interface CategoriasResponse {
    exito: boolean;
    categorias: Categoria[];
}

export interface ProductoResponse {
    actualizado: boolean;
    mensaje: string;
}