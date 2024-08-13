import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenChartModuleComponent } from './orden-chart-module.component';

describe('OrdenChartModuleComponent', () => {
  let component: OrdenChartModuleComponent;
  let fixture: ComponentFixture<OrdenChartModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdenChartModuleComponent]
    });
    fixture = TestBed.createComponent(OrdenChartModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
