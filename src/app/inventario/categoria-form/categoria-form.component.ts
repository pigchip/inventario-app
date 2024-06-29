import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { Categoria } from '../../model/Categoria';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {
  categoria: Categoria = {
    idCategoria: 0,
    nombreCategoria: '',
    descripcionCategoria: ''
  };
  displayDialog: boolean = false;

  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoria.idCategoria = +id;
        this.cargarDatosCategoria();
      }
    });
  }

  cargarDatosCategoria() {
    if (this.categoria.idCategoria !== 0) {
      this.serviceService.getCategoria(this.categoria.idCategoria).subscribe(
        (response) => {
          this.categoria = response;
        },
        (error) => {
          console.error('Error al cargar datos de la categoría:', error);
          this.limpiarCampos();
        }
      );
    } else {
      this.limpiarCampos();
    }
  }

  limpiarCampos() {
    this.categoria = {
      idCategoria: 0,
      nombreCategoria: '',
      descripcionCategoria: ''
    };
  }

  confirmDelete() {
    if (this.categoria.idCategoria !== 0) {
      this.serviceService.deleteCategoria(this.categoria.idCategoria).subscribe(
        () => {
          alert('Categoría eliminada correctamente');
          this.router.navigate(['/categorias']);
        },
        (error) => {
          console.error('Error al eliminar la categoría:', error);
        }
      );
    } else {
      alert('Debe ingresar un ID válido para eliminar una categoría');
    }
  }

  confirmSave() {
    if (this.validarCategoria()) {
      if (this.categoria.idCategoria === 0) {
        this.serviceService.createCategoria(this.categoria).subscribe(
          () => {
            alert('Categoría creada correctamente');
            this.router.navigate(['/categorias']);
          },
          (error) => {
            console.error('Error al crear la categoría:', error);
          }
        );
      } else {
        this.serviceService.updateCategoria(this.categoria.idCategoria, this.categoria).subscribe(
          () => {
            alert('Categoría actualizada correctamente');
            this.router.navigate(['/categorias']);
          },
          (error) => {
            console.error('Error al actualizar la categoría:', error);
          }
        );
      }
    }
  }

  validarCategoria(): boolean {
    if (!this.categoria.nombreCategoria || this.categoria.nombreCategoria.trim().length === 0) {
      alert('El nombre de la categoría es requerido');
      return false;
    }
    if (!this.categoria.descripcionCategoria || this.categoria.descripcionCategoria.trim().length === 0) {
      alert('La descripción de la categoría es requerida');
      return false;
    }
    if (this.categoria.idCategoria < 0) {
      alert('El ID de la categoría no puede ser negativo');
      return false;
    }
    return true;
  }

  get isNombreCategoriaInvalid(): boolean {
    return !this.categoria.nombreCategoria || this.categoria.nombreCategoria.trim().length === 0;
  }

  get isDescripcionCategoriaInvalid(): boolean {
    return !this.categoria.descripcionCategoria || this.categoria.descripcionCategoria.trim().length === 0;
  }

  get isIdCategoriaInvalid(): boolean {
    return this.categoria.idCategoria < 0;
  }

  onInputChange(event: Event, field: keyof Categoria) {
    const input = event.target as HTMLInputElement;
    this.categoria[field] = input.value as unknown as never;
  }

  hideDialog() {
    this.displayDialog = false;
  }
}
