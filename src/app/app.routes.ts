import { Routes } from '@angular/router';
import { ProductoComponent } from './inventario/producto/producto.component';
import { HomeComponent } from './home/home.component';
import { CategoriaComponent } from './inventario/categoria/categoria.component';
import { ProductoFormComponent } from './inventario/producto-form/producto-form.component';
import { ProductosPorCategoriaComponent } from './inventario/productos-por-categoria/productos-por-categoria.component';
import { MovimientoComponent } from './inventario/movimiento/movimiento.component';
import { MovimientoFormComponent } from './inventario/movimiento-form/movimiento-form.component';
import { CategoriaFormComponent } from './inventario/categoria-form/categoria-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'productos',
    component: ProductoComponent,
  },
  {
    path: 'productosForm',
    component: ProductoFormComponent,
  },
  {
    path: 'productosForm/:id',
    component: ProductoFormComponent,
  },
  {
    path: 'movimientos',
    component: MovimientoComponent,
  },
  {
    path: 'movimientosForm',
    component: MovimientoFormComponent,
  },
  {
    path: 'movimientosForm/:id',
    component: MovimientoFormComponent,
  },
  {
    path: 'categorias',
    component: CategoriaComponent,
  },
  {
    path: 'categoriasForm',
    component: CategoriaFormComponent,
  },
  {
    path: 'categoriasForm/:id',
    component: CategoriaFormComponent,
  },
  {
    path: 'productos-por-categoria',
    component: ProductosPorCategoriaComponent,
  },
];
