import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturersFormComponent } from './manufacturers-form.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingProductsModule } from '../../../products/app-routing-products.module';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('ManufacturersFormComponent', () => {
  let component: ManufacturersFormComponent;
  let fixture: ComponentFixture<ManufacturersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersFormComponent],
      providers: [
        provideHttpClient(withFetch()),
        provideEnvironmentNgxMask(),
      ],
      imports: [
        RouterModule.forRoot([]),
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
      ]
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
