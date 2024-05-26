import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoutFormPage } from './scout-form.page';

describe('ScoutFormPage', () => {
  let component: ScoutFormPage;
  let fixture: ComponentFixture<ScoutFormPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScoutFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
