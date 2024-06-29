export interface Producto {
    idProducto: number;
}
  
  export interface Movimiento {
    tipoMovimiento: string;
    fechaMovimiento: string;
    cantidad: number;
    producto: Producto;
  }