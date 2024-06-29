import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../service/service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MovimientoDTO } from '../../model/MovimientoDTO';

@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movimiento.component.html',
  styleUrls: ['./movimiento.component.css']
})
export class MovimientoComponent implements OnInit {
  titulo: string = 'Lista de Movimientos';
  movimientos: MovimientoDTO[] = [];
  paginatedMovimientos: MovimientoDTO[] = [];
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
    this.getMovimientos();
  }

  getMovimientos() {
    this.serviceService.getMovimientos().subscribe(
      (data: MovimientoDTO[]) => {
        this.movimientos = data;
        this.totalPages = Math.ceil(this.movimientos.length / this.itemsPerPage);
        this.sortMovimientos();
        this.setPage(1);
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los movimientos:', error);
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
    this.paginatedMovimientos = this.movimientos.slice(startIndex, endIndex);
  }

  setItemsPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const items = Number(target.value);
    this.itemsPerPage = items;
    this.totalPages = Math.ceil(this.movimientos.length / this.itemsPerPage);
    this.setPage(1);
  }

  sortMovimientos() {
    this.movimientos.sort((a, b) => {
      const res = a.idMovimiento - b.idMovimiento;
      return this.sortDirection ? res : -res;
    });
    this.setPage(1);
  }

  toggleSortDirection() {
    this.sortDirection = !this.sortDirection;
    this.sortMovimientos();
  }

  get pagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  editarMovimiento(id: number) {
    this.router.navigate(['/movimientosForm', id]);
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
      this.eliminarMovimiento(id);
    }
  }

  eliminarMovimiento(id: number) {
    this.serviceService.deleteMovimiento(id).subscribe(
      () => {
        alert('Movimiento eliminado correctamente');
        this.getMovimientos();
      },
      (error: HttpErrorResponse) => {
        alert('Error al eliminar el movimiento');
        console.error('Error al eliminar movimiento:', error);
      }
    );
  }
}
