import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { Producto } from '../../model/Producto';
import { Categoria } from '../../model/Categoria';
import { ProductoDTO } from '../../model/ProductoDTO';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  productoDTO: ProductoDTO = {
    idProducto: 0,
    nombreProducto: '',
    descripcionProducto: '',
    precio: 0,
    existencia: 0,
    idCategoria: 0,
  };

  producto: Producto = {
    idProducto: 0,
    nombreProducto: '',
    descripcionProducto: '',
    precio: 0,
    existencia: 0,
    idCategoria: {
      idCategoria: 0,
      nombreCategoria: '',
      descripcionCategoria: ''
    }
  };
  categorias: Categoria[] = [];
  displayDialog: boolean = false;

  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.producto.idProducto = +id;
        this.cargarDatosProducto();
      }
    });
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.serviceService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  cargarDatosProducto() {
    if (this.producto.idProducto !== 0) {
      this.serviceService.getProducto(this.producto.idProducto).subscribe(
        (response) => {
          this.producto = response;
          if (!this.producto.idCategoria) {
            this.producto.idCategoria = { idCategoria: 0, nombreCategoria: '', descripcionCategoria: '' };
          }
        },
        (error) => {
          console.error('Error al cargar datos del producto:', error);
          this.limpiarCampos();
        }
      );
    } else {
      this.limpiarCampos();
    }
  }

  limpiarCampos() {
    this.producto = {
      idProducto: 0,
      nombreProducto: '',
      descripcionProducto: '',
      precio: 0,
      existencia: 0,
      idCategoria: {
        idCategoria: 0,
        nombreCategoria: '',
        descripcionCategoria: ''
      }
    };
  }

  confirmDelete() {
    if (this.producto.idProducto !== 0) {
      this.serviceService.deleteProducto(this.producto.idProducto).subscribe(
        () => {
          alert('Producto eliminado correctamente');
          this.router.navigate(['/productos']);
        },
        (error) => {
          console.error('Error al eliminar el producto:', error);
        }
      );
    } else {
      alert('Debe ingresar un ID válido para eliminar un producto');
    }
  }

  confirmSave() {
    if (this.validarProducto()) {
      this.productoDTO.idProducto = this.producto.idProducto;
      this.productoDTO.nombreProducto = this.producto.nombreProducto;
      this.productoDTO.descripcionProducto = this.producto.descripcionProducto;
      this.productoDTO.precio = this.producto.precio;
      this.productoDTO.existencia = this.producto.existencia;
      this.productoDTO.idCategoria = this.producto.idCategoria.idCategoria;

      if (this.producto.idProducto === 0) {
        this.serviceService.createProducto(this.productoDTO).subscribe(
          () => {
            alert('Producto creado correctamente');
            this.router.navigate(['/productos']);
          },
          (error) => {
            console.error('Error al crear el producto:', error);
          }
        );
      } else {
        this.serviceService.updateProducto(this.producto.idProducto, this.productoDTO).subscribe(
          () => {
            alert('Producto actualizado correctamente');
            this.router.navigate(['/productos']);
          },
          (error) => {
            console.error('Error al actualizar el producto:', error);
          }
        );
      }
    }
  }

  validarProducto(): boolean {
    if (!this.producto.nombreProducto || this.producto.nombreProducto.trim().length === 0) {
      alert('El nombre del producto es requerido');
      return false;
    }
    if (!this.producto.descripcionProducto || this.producto.descripcionProducto.trim().length === 0) {
      alert('La descripción del producto es requerida');
      return false;
    }
    if (this.producto.precio < 0 || !Number.isInteger(this.producto.precio)) {
      alert('El precio debe ser un número entero positivo');
      return false;
    }
    if (this.producto.existencia < 0 || !Number.isInteger(this.producto.existencia)) {
      alert('La existencia debe ser un número entero positivo');
      return false;
    }
    if (this.producto.idCategoria.idCategoria <= 0) {
      alert('La categoría es requerida');
      return false;
    }
    if (this.producto.idProducto < 0) {
      alert('El ID del producto no puede ser negativo');
      return false;
    }
    return true;
  }

  get isNombreProductoInvalid(): boolean {
    return !this.producto.nombreProducto || this.producto.nombreProducto.trim().length === 0;
  }

  get isDescripcionProductoInvalid(): boolean {
    return !this.producto.descripcionProducto || this.producto.descripcionProducto.trim().length === 0;
  }

  get isPrecioInvalid(): boolean {
    return this.producto.precio < 0 || !Number.isInteger(this.producto.precio);
  }

  get isExistenciaInvalid(): boolean {
    return this.producto.existencia < 0 || !Number.isInteger(this.producto.existencia);
  }

  get isCategoriaInvalid(): boolean {
    return this.producto.idCategoria.idCategoria <= 0;
  }

  get isIdProductoInvalid(): boolean {
    return this.producto.idProducto < 0;
  }

  onInputChange(event: Event, field: keyof Producto) {
    const input = event.target as HTMLInputElement;
    switch(field) {
      case 'idCategoria':
        const categoriaId = parseInt(input.value);
        this.producto.idCategoria = this.categorias.find(c => c.idCategoria === categoriaId) || {
          idCategoria: 0,
          nombreCategoria: '',
          descripcionCategoria: ''
        };
        break;
      case 'precio':
      case 'existencia':
        this.producto[field] = +input.value;
        break;
      default:
        this.producto[field] = input.value as unknown as never;
        break;
    }
  }

  hideDialog() {
    this.displayDialog = false;
  }
}
