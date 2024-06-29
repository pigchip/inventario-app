import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../model/Producto';
import { ServiceService } from '../../service/service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  titulo: string = 'Lista de Productos';
  productos: Producto[] = [];
  paginatedProductos: Producto[] = [];
  loading: boolean = true;

  // Variables para la paginación y ordenamiento
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  sortDirection: boolean = true;  // true for ascending, false for descending

  constructor(
    private serviceService: ServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProductos();
  }

  getProductos() {
    this.serviceService.getProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
        this.totalPages = Math.ceil(this.productos.length / this.itemsPerPage);
        this.sortProductos();
        this.setPage(1);
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.loading = false;
      }
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProductos = this.productos.slice(startIndex, endIndex);
  }

  setItemsPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const items = Number(target.value);
    this.itemsPerPage = items;
    this.totalPages = Math.ceil(this.productos.length / this.itemsPerPage);
    this.setPage(1);
  }

  sortProductos() {
    this.productos.sort((a, b) => {
      const res = a.idProducto - b.idProducto;
      return this.sortDirection ? res : -res;
    });
    this.setPage(1);
  }

  toggleSortDirection() {
    this.sortDirection = !this.sortDirection;
    this.sortProductos();
  }

  get pagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  editarProducto(id: number) {
    this.router.navigate(['/productosForm', id]);
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.eliminarProducto(id);
    }
  }

  eliminarProducto(id: number) {
    this.serviceService.deleteProducto(id).subscribe(
      () => {
        alert('Producto eliminado correctamente');
        this.getProductos();
      },
      (error: HttpErrorResponse) => {
        alert('Error al eliminar el producto');
        console.error('Error al eliminar producto:', error);
      }
    );
  }
}
