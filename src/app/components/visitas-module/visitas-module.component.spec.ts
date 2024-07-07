import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasModuleComponent } from './visitas-module.component';

describe('VisitasModuleComponent', () => {
  let component: VisitasModuleComponent;
  let fixture: ComponentFixture<VisitasModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitasModuleComponent]
    });
    fixture = TestBed.createComponent(VisitasModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
