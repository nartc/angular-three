import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactShadowsComponent } from './contact-shadows.component';

describe('ContactShadowsComponent', () => {
  let component: ContactShadowsComponent;
  let fixture: ComponentFixture<ContactShadowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactShadowsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactShadowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
