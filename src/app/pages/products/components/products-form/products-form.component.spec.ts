import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFormComponent } from './products-form.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { SharedModule } from '../../../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { Manufacturer } from '../../../manufacturers/models/manufacturer';
import { ManufacturersService } from '../../../manufacturers/services/manufacturers.service';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { of, throwError } from 'rxjs';

describe('ProductsFormComponent', () => {
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;
  let productsService: ProductsService;
  let manufacturersService: ManufacturersService;
  let loadingService: LoadingService;
  let toasterService: ToasterService;
  let router: Router;

  const mockProduct: Product = {
    "nome": "Coca-Cola2",
    "descricao": "Com sabor inconfundível e único, uma Coca-Cola Original é o refrigerante mais tradicional econsumido no mundo inteiro! Toda Coca-Cola Original é especialmente concebido para manter sempre a qualidade do melhor sabor de refrigerante! É perfeita para compartilhar os melhores momentos da vida com amigos e familiaresa!",
    "codigoBarras": "7894900011712",
    "fabricanteID": 72
  }

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
        provideHttpClient(),
        provideEnvironmentNgxMask(),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsFormComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    manufacturersService = TestBed.inject(ManufacturersService);
    loadingService = TestBed.inject(LoadingService);
    toasterService = TestBed.inject(ToasterService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('nome')).toBeTruthy();
    expect(component.productForm.get('fabricanteID')).toBeTruthy();
    expect(component.productForm.get('codigoBarras')).toBeTruthy();
    expect(component.productForm.get('descricao')).toBeTruthy();
  });

  it('should call verifyFormAction, getManufacturers and manufacturerChange', () => {
    spyOn(component, 'verifyFormAction');
    spyOn(component, 'getManufacturers');
    spyOn(component, 'manufacturerChange');
    component.ngOnInit();
    expect(component.verifyFormAction).toHaveBeenCalled();
    expect(component.getManufacturers).toHaveBeenCalled();
    expect(component.manufacturerChange).toHaveBeenCalled();
  });

  it('should get manufacturers on init', () => {
    spyOn(manufacturersService, 'searchManufacturersByName').and.returnValue(of(mockPaginatedResponse));
    spyOn(loadingService, 'show');
    spyOn(loadingService, 'hide');
    component.ngOnInit();
    expect(manufacturersService.searchManufacturersByName).toHaveBeenCalledWith('', component.pageSize, component.pageIndex);
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should create a product', () => {
    spyOn(productsService, 'createProduct').and.returnValue(of(mockProduct));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    spyOn(router, 'navigate');
    component.action = 'create';
    component.createProduct();
    expect(toasterService.showToast).toHaveBeenCalledWith('Produto cadastrado com sucesso', 'success');
    expect(loadingService.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should handle errors when creating a product', () => {
    spyOn(productsService, 'createProduct').and.returnValue(throwError(() => new Error('Erro')));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    component.action = 'create';
    component.createProduct();
    expect(toasterService.showToast).toHaveBeenCalledWith('Ocorreu um erro ao cadastrar o produto', 'error');
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should edit a product', () => {
    spyOn(productsService, 'editProduct').and.returnValue(of(mockProduct));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    spyOn(router, 'navigate');
    component.action = 'edit';
    component.editProduct();
    expect(toasterService.showToast).toHaveBeenCalledWith('Produto alterado com sucesso', 'success');
    expect(loadingService.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should handle errors when editing a product', () => {
    spyOn(productsService, 'editProduct').and.returnValue(throwError(() => new Error('Erro')));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    component.action = 'edit';
    component.editProduct();
    expect(toasterService.showToast).toHaveBeenCalledWith('Ocorreu um erro ao editar o produto', 'error');
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should set form data from Product object', () => {
    const product: Product = {
      nome: 'Product 1',
      fabricante: {
        id: 1,
        nome: "Teste",
        cnpj: "47944006000180",
        cep: "04551010",
        logradouro: "Rua Fidêncio Ramos",
        numero: "308",
        complemento: "1 andar",
        bairro: "Vila Olímpia",
        cidade: "São Paulo",
        estado: "São Paulo",
        contatoTipo: "Email",
        contato: "contato@teste.com.br"
      },
      codigoBarras: '123456',
      descricao: 'Description'
    };
    component.setFormData(product);
    expect(component.productForm.get('nome')?.value).toBe('Product 1');
    expect(component.productForm.get('fabricanteID')?.value).toBe(1);
    expect(component.productForm.get('codigoBarras')?.value).toBe('123456');
    expect(component.productForm.get('descricao')?.value).toBe('Description');
  });

  it('should return the name of the manufacturer', () => {
    const manufacturer: Manufacturer = {
      id: 1,
      nome: "Teste",
      cnpj: "47944006000180",
      cep: "04551010",
      logradouro: "Rua Fidêncio Ramos",
      numero: "308",
      complemento: "1 andar",
      bairro: "Vila Olímpia",
      cidade: "São Paulo",
      estado: "São Paulo",
      contatoTipo: "Email",
      contato: "contato@teste.com.br"
    };
    expect(component.displayFn(manufacturer)).toBe('Teste');
  });

  it('should return an empty string if manufacturer is null', () => {
    expect(component.displayFn(null as unknown as Manufacturer)).toBe('');
  });
});
