import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosModuleComponent } from './empleados-module.component';

describe('EmpleadosModuleComponent', () => {
  let component: EmpleadosModuleComponent;
  let fixture: ComponentFixture<EmpleadosModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpleadosModuleComponent]
    });
    fixture = TestBed.createComponent(EmpleadosModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
