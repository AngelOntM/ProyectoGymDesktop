import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsRegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: ProductsRegisterFormComponent;
  let fixture: ComponentFixture<ProductsRegisterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsRegisterFormComponent]
    });
    fixture = TestBed.createComponent(ProductsRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
