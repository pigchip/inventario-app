import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../model/Producto';
import { ProductoDTO } from '../model/ProductoDTO';
import { Categoria } from '../model/Categoria';
import { ProductoCategoria } from '../model/ProductosCategoria';
import { MovimientoDTO } from '../model/MovimientoDTO';
import { Movimiento } from '../model/Movimiento';
import { CategoriaDTO } from '../model/CategoriaDTO';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl = 'https://inventario-baxy.onrender.com';

  constructor(private http: HttpClient) { }

  // Métodos para productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`);
  }

  getProductosPorCategoria(): Observable<ProductoCategoria[]> {
    return this.http.get<ProductoCategoria[]>(`${this.baseUrl}/productos/productosPorCategoria`);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/productos/${id}`);
  }

  createProducto(producto: ProductoDTO): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/productos`, producto);
  }

  updateProducto(id: number, producto: ProductoDTO): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/productos/${id}`, producto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/productos/${id}`);
  }

  // Método para obtener categorías
  createCategoria(categorias: Categoria): Observable<CategoriaDTO> {
    return this.http.post<Categoria>(`${this.baseUrl}/categorias`, categorias);
  }

  updateCategoria(id: number, categorias: Categoria): Observable<CategoriaDTO> {
    return this.http.put<CategoriaDTO>(`${this.baseUrl}/categorias/${id}`, categorias);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/categorias/${id}`);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categorias/${id}`);
  }

  // Método para obtener categorías
  createMovimiento(movimiento: Movimiento): Observable<MovimientoDTO> {
    return this.http.post<MovimientoDTO>(`${this.baseUrl}/movimientos`, movimiento);
  }

  getMovimientos(): Observable<MovimientoDTO[]> {
    return this.http.get<MovimientoDTO[]>(`${this.baseUrl}/movimientos`);
  }

  updateMovimiento(id: number, producto: Movimiento): Observable<MovimientoDTO> {
    return this.http.put<MovimientoDTO>(`${this.baseUrl}/movimientos/${id}`, producto);
  }

  getMovimiento(id: number): Observable<MovimientoDTO> {
    return this.http.get<MovimientoDTO>(`${this.baseUrl}/movimientos/${id}`);
  }

  deleteMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/movimientos/${id}`);
  }
}
