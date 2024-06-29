import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../service/service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Categoria } from '../../model/Categoria';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  titulo: string = 'Lista de Categorías';
  categorias: Categoria[] = [];
  paginatedCategorias: Categoria[] = [];
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
    this.serviceService.getCategorias().subscribe(
      (data: Categoria[]) => {
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
      const res = a.idCategoria - b.idCategoria;
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

  editarCategoria(id: number) {
    this.router.navigate(['/categoriasForm', id]);
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.eliminarCategoria(id);
    }
  }

  eliminarCategoria(id: number) {
    this.serviceService.deleteCategoria(id).subscribe(
      () => {
        alert('Categoría eliminada correctamente');
        this.getCategorias();
      },
      (error: HttpErrorResponse) => {
        alert('Error al eliminar la categoría');
        console.error('Error al eliminar categoría:', error);
      }
    );
  }
}
