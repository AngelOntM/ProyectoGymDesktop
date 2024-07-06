import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenModuleComponent } from './orden-module.component';

describe('OrdenModuleComponent', () => {
  let component: OrdenModuleComponent;
  let fixture: ComponentFixture<OrdenModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdenModuleComponent]
    });
    fixture = TestBed.createComponent(OrdenModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
