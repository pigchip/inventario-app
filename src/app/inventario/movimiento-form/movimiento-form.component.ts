import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { ProductoDTO } from '../../model/ProductoDTO';
import { MovimientoDTO } from '../../model/MovimientoDTO';
import { Movimiento } from '../../model/Movimiento';
import { Producto } from '../../model/Producto';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movimiento-form.component.html',
  styleUrls: ['./movimiento-form.component.css']
})
export class MovimientoFormComponent implements OnInit {
  movimientoForm: FormGroup;
  productos: Producto[] = [];

  movimiento: MovimientoDTO = {
    idMovimiento: 0,
    tipoMovimiento: '',
    fechaMovimiento: '',
    cantidad: 0,
    producto: {
      idProducto: 0,
      nombreProducto: '',
      descripcionProducto: '',
      precio: 0,
      existencia: 0,
      idCategoria: 0
    }
  };

  constructor(
    private apiService: ServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.movimientoForm = this.formBuilder.group({
      idMovimiento: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
      tipoMovimiento: ['', Validators.required],
      fechaMovimiento: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      producto: this.formBuilder.group({
        idProducto: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.movimiento.idMovimiento = +id;
        this.cargarDatosMovimiento();
      }
    });
    this.cargarProductos();
  }

  cargarProductos() {
    this.apiService.getProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  cargarDatosMovimiento() {
    if (this.movimiento.idMovimiento !== 0) {
      this.apiService.getMovimiento(this.movimiento.idMovimiento).subscribe(
        (response) => {
          this.movimiento = response;
          if (!this.movimiento.producto) {
            this.movimiento.producto = {
              idProducto: 0,
              nombreProducto: '',
              descripcionProducto: '',
              precio: 0,
              existencia: 0,
              idCategoria: 0
            };
          }
          this.movimientoForm.patchValue({
            idMovimiento: this.movimiento.idMovimiento,
            tipoMovimiento: this.movimiento.tipoMovimiento,
            fechaMovimiento: this.movimiento.fechaMovimiento,
            cantidad: this.movimiento.cantidad,
            producto: {
              idProducto: this.movimiento.producto.idProducto
            }
          });
        },
        (error) => {
          console.error('Error al cargar datos del movimiento:', error);
          this.limpiarCampos();
        }
      );
    } else {
      this.limpiarCampos();
    }
  }

  limpiarCampos() {
    this.movimiento = {
      idMovimiento: 0,
      tipoMovimiento: '',
      fechaMovimiento: '',
      cantidad: 0,
      producto: {
        idProducto: 0,
        nombreProducto: '',
        descripcionProducto: '',
        precio: 0,
        existencia: 0,
        idCategoria: 0
      }
    };
    this.movimientoForm.reset();
  }

  confirmDelete() {
    const idMovimiento = this.movimientoForm.get('idMovimiento')?.value;
    if (idMovimiento) {
      this.apiService.deleteMovimiento(idMovimiento).subscribe(
        () => {
          alert('Movimiento eliminado correctamente');
          this.router.navigate(['/movimientos']);
        },
        (error) => {
          console.error('Error al eliminar el movimiento:', error);
        }
      );
    } else {
      alert('Debe ingresar un ID válido para eliminar un movimiento');
    }
  }

  onSubmit() {
    if (this.movimientoForm.valid) {
      const movimiento: Movimiento = {
        tipoMovimiento: this.movimientoForm.value.tipoMovimiento,
        fechaMovimiento: this.movimientoForm.value.fechaMovimiento,
        cantidad: this.movimientoForm.value.cantidad,
        producto: this.movimientoForm.value.producto
      };

      if (this.movimientoForm.value.idMovimiento === 0 || !this.movimientoForm.value.idMovimiento) {
        this.apiService.createMovimiento(movimiento).subscribe(
          () => {
            alert('Movimiento creado correctamente');
            this.router.navigate(['/movimientos']);
          },
          (error) => {
            console.error('Error al crear el movimiento:', error);
          }
        );
      } else {
        this.apiService.updateMovimiento(this.movimientoForm.value.idMovimiento, movimiento).subscribe(
          () => {
            alert('Movimiento actualizado correctamente');
            this.router.navigate(['/movimientos']);
          },
          (error) => {
            console.error('Error al actualizar el movimiento:', error);
          }
        );
      }
    } else {
      this.showValidationErrors();
    }
  }

  showValidationErrors() {
    const controls = this.movimientoForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        const errors = controls[name].errors;
        if (errors) {
          if (errors['required']) {
            alert(`${name} es requerido`);
          }
          if (errors['min']) {
            alert(`${name} debe ser mayor o igual a ${name === 'idMovimiento' ? 0 : 1}`);
          }
          if (errors['pattern']) {
            alert(`${name} debe ser un número entero positivo`);
          }
        }
      }
    }
  }
}
