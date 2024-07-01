import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsUpdateFormComponent } from './update-form.component';

describe('UpdateFormComponent', () => {
  let component: ProductsUpdateFormComponent;
  let fixture: ComponentFixture<ProductsUpdateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsUpdateFormComponent]
    });
    fixture = TestBed.createComponent(ProductsUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
