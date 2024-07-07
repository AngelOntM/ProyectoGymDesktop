import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ClientesModuleComponent } from './components/clientes-module/clientes-module.component';
import { EmpleadosModuleComponent } from './components/empleados-module/empleados-module.component';
import { MembresiasModuleComponent } from './components/membresias-module/membresias-module.component';
import { ProductosModuleComponent } from './components/productos-module/productos-module.component';
import { OrdenModuleComponent } from './components/orden-module/orden-module.component';
import { DetalleComponent } from './components/orden-module/detalle/detalle.component';
import { AddOrdenComponent } from './components/orden-module/add-orden/add-orden.component';
import { VisitasModuleComponent } from './components/visitas-module/visitas-module.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'home', component: LayoutComponent, children: [
    { path: 'clientes', component: ClientesModuleComponent },
    { path: 'empleados', component: EmpleadosModuleComponent },
    { path: 'membresias', component: MembresiasModuleComponent },
    { path: 'productos', component: ProductosModuleComponent },
    { path: 'ordenes', component: OrdenModuleComponent},
    { path: 'ordenesDetalle/:id', component: DetalleComponent },
    { path: 'ordenAdd', component: AddOrdenComponent },
    { path: 'visitas', component: VisitasModuleComponent },
  ]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
