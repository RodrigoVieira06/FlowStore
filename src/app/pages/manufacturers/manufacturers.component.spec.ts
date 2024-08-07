import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturersComponent } from './manufacturers.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AppRoutingManufacturersModule } from './app-routing-manufacturers.module';

describe('ManufacturersComponent', () => {
  let component: ManufacturersComponent;
  let fixture: ComponentFixture<ManufacturersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersComponent],
      imports: [
        CommonModule,
        SharedModule,
        AppRoutingManufacturersModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManufacturersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should render header title', () => {
    const fixture = TestBed.createComponent(ManufacturersComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Fabricantes');
  });
});
