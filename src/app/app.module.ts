import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { LayoutComponent } from './layout/layout.component';
import { ClientesModuleComponent } from './components/clientes-module/clientes-module.component';

import { MatTableModule } from '@angular/material/table';
import { MatTableFilterModule } from 'ng-mat-table-filter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EmpleadosModuleComponent } from './components/empleados-module/empleados-module.component';

import { HttpClientModule } from '@angular/common/http';
import { RegisterFormComponent } from './components/clientes-module/register-form/register-form.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UpdateFormComponent } from './components/clientes-module/update-form/update-form.component';
import { EmployeeRegisterFormComponent } from './components/empleados-module/register-form/register-form.component';
import { EmployeeUpdateFormComponent } from './components/empleados-module/update-form/update-form.component';
import { MembresiasModuleComponent } from './components/membresias-module/membresias-module.component';
import { MembresiaRegisterFormComponent } from './components/membresias-module/register-form/register-form.component';
import { MembresiaUpdateFormComponent } from './components/membresias-module/update-form/update-form.component';
import { MatSelectModule } from '@angular/material/select';
import { ProductosModuleComponent } from './components/productos-module/productos-module.component';
import { ProductsRegisterFormComponent } from './components/productos-module/register-form/register-form.component';
import { ProductsUpdateFormComponent } from './components/productos-module/update-form/update-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    ClientesModuleComponent,
    EmpleadosModuleComponent,
    RegisterFormComponent,
    UpdateFormComponent,
    EmployeeRegisterFormComponent,
    EmployeeUpdateFormComponent,
    MembresiasModuleComponent,
    MembresiaRegisterFormComponent,
    MembresiaUpdateFormComponent,
    ProductosModuleComponent,
    ProductsRegisterFormComponent,
    ProductsUpdateFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatTableFilterModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
