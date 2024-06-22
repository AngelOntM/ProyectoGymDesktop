import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiaRegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: MembresiaRegisterFormComponent;
  let fixture: ComponentFixture<MembresiaRegisterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembresiaRegisterFormComponent]
    });
    fixture = TestBed.createComponent(MembresiaRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
