import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitChartModuleComponent } from './visit-chart-module.component';

describe('VisitChartModuleComponent', () => {
  let component: VisitChartModuleComponent;
  let fixture: ComponentFixture<VisitChartModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitChartModuleComponent]
    });
    fixture = TestBed.createComponent(VisitChartModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
