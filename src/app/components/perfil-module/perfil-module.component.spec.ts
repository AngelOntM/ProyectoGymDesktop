import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilModuleComponent } from './perfil-module.component';

describe('PerfilModuleComponent', () => {
  let component: PerfilModuleComponent;
  let fixture: ComponentFixture<PerfilModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilModuleComponent]
    });
    fixture = TestBed.createComponent(PerfilModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
