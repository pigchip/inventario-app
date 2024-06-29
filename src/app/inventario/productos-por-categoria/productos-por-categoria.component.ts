import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../service/service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductoCategoria } from '../../model/ProductosCategoria';

@Component({
  selector: 'app-productos-por-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos-por-categoria.component.html',
  styleUrls: ['./productos-por-categoria.component.css']
})
export class ProductosPorCategoriaComponent implements OnInit {
  titulo: string = 'Productos por Categoría';
  categorias: ProductoCategoria[] = [];
  paginatedCategorias: ProductoCategoria[] = [];
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
    this.getCategorias();
  }

  getCategorias() {
    this.serviceService.getProductosPorCategoria().subscribe(
      (data: ProductoCategoria[]) => {
        this.categorias = data;
        this.totalPages = Math.ceil(this.categorias.length / this.itemsPerPage);
        this.sortCategorias();
        this.setPage(1);
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
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
    this.paginatedCategorias = this.categorias.slice(startIndex, endIndex);
  }

  setItemsPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const items = Number(target.value);
    this.itemsPerPage = items;
    this.totalPages = Math.ceil(this.categorias.length / this.itemsPerPage);
    this.setPage(1);
  }

  sortCategorias() {
    this.categorias.sort((a, b) => {
      const res = a.categoria.localeCompare(b.categoria);
      return this.sortDirection ? res : -res;
    });
    this.setPage(1);
  }

  toggleSortDirection() {
    this.sortDirection = !this.sortDirection;
    this.sortCategorias();
  }

  get pagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
