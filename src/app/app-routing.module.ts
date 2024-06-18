import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ClientesModuleComponent } from './components/clientes-module/clientes-module.component';
import { EmpleadosModuleComponent } from './components/empleados-module/empleados-module.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'home', component: LayoutComponent, children: [
    { path: 'home/clientes', component: ClientesModuleComponent },
    { path: 'home/empleados', component: EmpleadosModuleComponent }
  ]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
