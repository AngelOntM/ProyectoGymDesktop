import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesModuleComponent } from './clientes-module.component';

describe('ClientesModuleComponent', () => {
  let component: ClientesModuleComponent;
  let fixture: ComponentFixture<ClientesModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientesModuleComponent]
    });
    fixture = TestBed.createComponent(ClientesModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
