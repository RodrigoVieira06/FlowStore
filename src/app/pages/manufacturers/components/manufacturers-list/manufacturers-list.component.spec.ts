import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturersListComponent } from './manufacturers-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AppRoutingManufacturersModule } from '../../app-routing-manufacturers.module';
import { Router, RouterModule } from '@angular/router';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { ManufacturersService } from '../../services/manufacturers.service';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { Manufacturer } from '../../models/manufacturer';
import { of, throwError } from 'rxjs';

describe('ManufacturersListComponent', () => {
  let component: ManufacturersListComponent;
  let fixture: ComponentFixture<ManufacturersListComponent>;
  let manufacturersService: ManufacturersService;
  let loadingService: LoadingService;
  let toasterService: ToasterService;
  let router: Router;

  const mockManufacturer: Manufacturer = {
    id: 1,
    nome: 'Test Manufacturer',
    cnpj: '12345678000195',
    cep: '12345678',
    logradouro: 'Rua Teste',
    numero: '123',
    complemento: '',
    bairro: 'Bairro Teste',
    cidade: 'Cidade Teste',
    estado: 'SP',
    contato: 'test@test.com',
    contatoTipo: 'Email'
  };

  const mockPaginatedResponse: PaginatedResponse<Manufacturer> = {
    content: [mockManufacturer],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 2,
    "totalElements": 14,
    "last": false,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "numberOfElements": 10,
    "first": true,
    "empty": false
  };

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
        provideHttpClient(),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManufacturersListComponent);
    component = fixture.componentInstance;
    manufacturersService = TestBed.inject(ManufacturersService);
    loadingService = TestBed.inject(LoadingService);
    toasterService = TestBed.inject(ToasterService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get manufacturers on init', () => {
    spyOn(manufacturersService, 'getManufacturers').and.returnValue(of(mockPaginatedResponse));
    spyOn(loadingService, 'show');
    spyOn(loadingService, 'hide');
    component.ngOnInit();
    expect(manufacturersService.getManufacturers).toHaveBeenCalledWith(component.pageSize, component.currentPage);
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
    expect(component.entities).toEqual([mockManufacturer]);
  });

  it('should navigate to show manufacturer', () => {
    spyOn(router, 'navigate');
    component.showManufacturer('12345678000195');
    expect(router.navigate).toHaveBeenCalledWith(['/manufacturers/show', '12345678000195']);
  });

  it('should navigate to edit manufacturer', () => {
    spyOn(router, 'navigate');
    component.editManufacturer('12345678000195');
    expect(router.navigate).toHaveBeenCalledWith(['/manufacturers/edit', '12345678000195']);
  });

  it('should delete manufacturer', () => {
    spyOn(manufacturersService, 'deleteManufacturer').and.returnValue(of(mockManufacturer));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'show');
    spyOn(loadingService, 'hide');
    spyOn(component, 'getManufacturers');
    component.deleteManufacturers('1', 'Test Manufacturer');
    expect(manufacturersService.deleteManufacturer).toHaveBeenCalledWith('1');
    expect(toasterService.showToast).toHaveBeenCalledWith('O fabricante Test Manufacturer foi deletado com sucesso', 'success');
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
    expect(component.getManufacturers).toHaveBeenCalled();
  });

  it('should handle errors when deleting manufacturer', () => {
    spyOn(manufacturersService, 'deleteManufacturer').and.returnValue(throwError(() => new Error('Erro')));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    component.deleteManufacturers('1', 'Test Manufacturer');
    expect(manufacturersService.deleteManufacturer).toHaveBeenCalled();
    expect(toasterService.showToast).toHaveBeenCalledWith('Ocorreu um erro ao tentar deletar o fabricante Test Manufacturer', 'error');
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should update component with response', () => {
    component.updatecomponent(mockPaginatedResponse);
    expect(component.entities).toEqual([mockManufacturer]);
    expect(component.pageConfig).toEqual(mockPaginatedResponse);
  });

  it('should update pagination', () => {
    component.pageConfig = mockPaginatedResponse;
    component.updatePagination();
    expect(component.totalPages).toBe(2);
    expect(component.pages).toEqual([1, 2]);
  });

  it('should update visible pages', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    component.pages = Array.from({ length: 10 }, (v, k) => k + 1);
    component.updateVisiblePages();
    expect(component.visiblePages).toEqual([4, 5, 6, 7, 8]);
    expect(component.showStartEllipsis).toBe(true);
    expect(component.showEndEllipsis).toBe(true);
  });

  it('should go to page', () => {
    spyOn(component, 'getManufacturers');
    component.goToPage(2);
    expect(component.currentPage).toBe(1);
    expect(component.getManufacturers).toHaveBeenCalled();
  });

  it('should go to previous page', () => {
    spyOn(component, 'getManufacturers');
    component.currentPage = 1;
    component.prevPage();
    expect(component.currentPage).toBe(0);
    expect(component.getManufacturers).toHaveBeenCalled();
  });

  it('should go to next page', () => {
    spyOn(component, 'getManufacturers');
    component.currentPage = 0;
    component.totalPages = 2;
    component.nextPage();
    expect(component.currentPage).toBe(1);
    expect(component.getManufacturers).toHaveBeenCalled();
  });

  it('should change page size', () => {
    spyOn(component, 'getManufacturers');
    const event = { target: { value: '25' } } as unknown as Event;
    component.changePageSize(event);
    expect(component.pageSize).toBe(25);
    expect(component.currentPage).toBe(0);
    expect(component.getManufacturers).toHaveBeenCalled();
  });
});
