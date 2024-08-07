import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { AppRoutingManufacturersModule } from '../../../manufacturers/app-routing-manufacturers.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { ProductsService } from '../../services/products.service';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { Product } from '../../models/product';
import { of, throwError } from 'rxjs';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productsService: ProductsService;
  let loadingService: LoadingService;
  let toasterService: ToasterService;
  let confirmDialogService: ConfirmDialogService;
  let router: Router;

  const mockProduct: Product = {
    "nome": "Coca-Cola2",
    "descricao": "Com sabor inconfundível e único, uma Coca-Cola Original é o refrigerante mais tradicional econsumido no mundo inteiro! Toda Coca-Cola Original é especialmente concebido para manter sempre a qualidade do melhor sabor de refrigerante! É perfeita para compartilhar os melhores momentos da vida com amigos e familiaresa!",
    "codigoBarras": "7894900011712",
    "fabricanteID": 72
  }

  const mockPaginatedResponse: PaginatedResponse<Product> = {
    content: [mockProduct],
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
    productsService = TestBed.inject(ProductsService);
    loadingService = TestBed.inject(LoadingService);
    toasterService = TestBed.inject(ToasterService);
    confirmDialogService = TestBed.inject(ConfirmDialogService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get products on init', () => {
    spyOn(productsService, 'getProducts').and.returnValue(of(mockPaginatedResponse));
    spyOn(loadingService, 'show');
    spyOn(loadingService, 'hide');
    component.ngOnInit();
    expect(productsService.getProducts).toHaveBeenCalledWith(component.pageSize, component.currentPage);
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
    expect(component.entities).toEqual([mockProduct]);
  });

  it('should navigate to show product', () => {
    spyOn(router, 'navigate');
    component.showProduct('1234567890');
    expect(router.navigate).toHaveBeenCalledWith(['/products/show', '1234567890']);
  });

  it('should navigate to edit product', () => {
    spyOn(router, 'navigate');
    component.editProduct('1234567890');
    expect(router.navigate).toHaveBeenCalledWith(['/products/edit', '1234567890']);
  });

  it('should delete product', () => {
    spyOn(productsService, 'deleteProduct').and.returnValue(of(mockProduct));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'show');
    spyOn(loadingService, 'hide');
    spyOn(component, 'getProducts');
    component.deleteProducts('1', 'Test Product');
    expect(productsService.deleteProduct).toHaveBeenCalledWith('1');
    expect(toasterService.showToast).toHaveBeenCalledWith('O produto Test Product foi deletado com sucesso', 'success');
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
    expect(component.getProducts).toHaveBeenCalled();
  });

  it('should handle errors when deleting product', () => {
    spyOn(productsService, 'deleteProduct').and.returnValue(throwError(() => new Error('Erro')));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    component.deleteProducts('1', 'Test Product');
    expect(productsService.deleteProduct).toHaveBeenCalled();
    expect(toasterService.showToast).toHaveBeenCalledWith('Ocorreu um erro ao tentar deletar o produto Test Product', 'error');
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should update component with response', () => {
    component.updatecomponent(mockPaginatedResponse);
    expect(component.entities).toEqual([mockProduct]);
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
    spyOn(component, 'getProducts');
    component.goToPage(2);
    expect(component.currentPage).toBe(1);
    expect(component.getProducts).toHaveBeenCalled();
  });

  it('should go to previous page', () => {
    spyOn(component, 'getProducts');
    component.currentPage = 1;
    component.prevPage();
    expect(component.currentPage).toBe(0);
    expect(component.getProducts).toHaveBeenCalled();
  });

  it('should go to next page', () => {
    spyOn(component, 'getProducts');
    component.currentPage = 0;
    component.totalPages = 2;
    component.nextPage();
    expect(component.currentPage).toBe(1);
    expect(component.getProducts).toHaveBeenCalled();
  });

  it('should change page size', () => {
    spyOn(component, 'getProducts');
    const event = { target: { value: '25' } } as unknown as Event;
    component.changePageSize(event);
    expect(component.pageSize).toBe(25);
    expect(component.currentPage).toBe(0);
    expect(component.getProducts).toHaveBeenCalled();
  });
});
