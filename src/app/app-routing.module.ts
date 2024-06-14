import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ClientesModuleComponent } from './components/clientes-module/clientes-module.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'home', component: LayoutComponent, children: [
    { path: 'home/show', component: ClientesModuleComponent } // Ruta hija para ClientesModuleComponent
  ]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
