import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SharedModule } from '../../../../shared/shared.module';
import { AppRoutingManufacturersModule } from '../../../manufacturers/app-routing-manufacturers.module';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsListComponent],
      imports: [
        RouterModule.forRoot([]),
        CommonModule,
        AppRoutingManufacturersModule,
        SharedModule,
        ReactiveFormsModule
      ],
      providers: [
        provideHttpClient(withFetch()),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
