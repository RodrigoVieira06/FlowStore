import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturersListComponent } from './manufacturers-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AppRoutingManufacturersModule } from '../../app-routing-manufacturers.module';
import { RouterModule } from '@angular/router';

describe('ManufacturersListComponent', () => {
  let component: ManufacturersListComponent;
  let fixture: ComponentFixture<ManufacturersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersListComponent],
      imports: [
        RouterModule.forRoot([]),
        CommonModule,
        AppRoutingManufacturersModule,
        SharedModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe
      ],
      providers: [
        provideHttpClient(withFetch()),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManufacturersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
