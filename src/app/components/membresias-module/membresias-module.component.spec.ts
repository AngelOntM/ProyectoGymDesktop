import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiasModuleComponent } from './membresias-module.component';

describe('MembresiasModuleComponent', () => {
  let component: MembresiasModuleComponent;
  let fixture: ComponentFixture<MembresiasModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembresiasModuleComponent]
    });
    fixture = TestBed.createComponent(MembresiasModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
