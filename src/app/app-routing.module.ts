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
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'home', component: LayoutComponent, canActivate: [AuthGuard] , children: [
    { path: 'clientes', component: ClientesModuleComponent, canActivate: [RoleGuard], data: { roles: ["Admin", "Empleado"] } },
    { path: 'empleados', component: EmpleadosModuleComponent, canActivate: [RoleGuard], data: { roles: ["Admin"] } },
    { path: 'membresias', component: MembresiasModuleComponent, canActivate: [RoleGuard], data: { roles: ["Admin", "Empleado"] } },
    { path: 'productos', component: ProductosModuleComponent, canActivate: [RoleGuard], data: { roles: ["Admin", "Empleado"] } },
    { path: 'ordenes', component: OrdenModuleComponent, canActivate: [RoleGuard], data: { roles: ["Admin"] }},
    { path: 'ordenesDetalle/:id', component: DetalleComponent, canActivate: [RoleGuard], data: { roles: ["Admin"] } },
    { path: 'ordenAdd', component: AddOrdenComponent, canActivate: [RoleGuard], data: { roles: ["Admin", "Empleado"] } },
    { path: 'visitas', component: VisitasModuleComponent, canActivate: [RoleGuard], data: { roles: ["Admin", "Empleado"] } },
  ]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
