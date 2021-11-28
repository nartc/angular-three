import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtCanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  let component: NgtCanvasComponent;
  let fixture: ComponentFixture<NgtCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgtCanvasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
