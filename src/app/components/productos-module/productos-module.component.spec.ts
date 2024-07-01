import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosModuleComponent } from './productos-module.component';

describe('ProductosModuleComponent', () => {
  let component: ProductosModuleComponent;
  let fixture: ComponentFixture<ProductosModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosModuleComponent]
    });
    fixture = TestBed.createComponent(ProductosModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
