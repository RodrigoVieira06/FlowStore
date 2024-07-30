import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturersFormComponent } from './manufacturers-form.component';

describe('ManufacturersFormComponent', () => {
  let component: ManufacturersFormComponent;
  let fixture: ComponentFixture<ManufacturersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
