import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFormComponent } from './products-form.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';

describe('ProductsFormComponent', () => {
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsFormComponent],
      imports: [
        RouterModule.forRoot([]),
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        MatAutocompleteModule,
        MatInputModule
      ],
      providers: [
        provideHttpClient(withFetch()),
        provideEnvironmentNgxMask(),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
