import { Categoria } from './Categoria';

export interface Producto {
  idProducto: number;
  nombreProducto: string;
  descripcionProducto: string;
  precio: number;
  existencia: number;
  idCategoria: Categoria;
}
