import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturersFormComponent } from './manufacturers-form.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CepService } from '../../../../shared/services/cep/cep.service';
import { of, throwError } from 'rxjs';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { ManufacturersService } from '../../services/manufacturers.service';
import { Manufacturer } from '../../models/manufacturer';

describe('ManufacturersFormComponent', () => {
  let component: ManufacturersFormComponent;
  let fixture: ComponentFixture<ManufacturersFormComponent>;
  let cepService: CepService;
  let loadingService: LoadingService;
  let toasterService: ToasterService;
  let manufacturersService: ManufacturersService;
  const mockManufacturer: Manufacturer = {
    "id": 72,
    "nome": "Voltta",
    "cnpj": "47944006000180",
    "cep": "04551010",
    "logradouro": "Rua Fidêncio Ramos",
    "numero": "308",
    "complemento": "1 andar",
    "bairro": "Vila Olímpia",
    "cidade": "São Paulo",
    "estado": "São Paulo",
    "contatoTipo": "Email",
    "contato": "contato@voltta.com.br"
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersFormComponent],
      providers: [
        provideHttpClient(),
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
    cepService = TestBed.inject(CepService);
    loadingService = TestBed.inject(LoadingService);
    toasterService = TestBed.inject(ToasterService);
    manufacturersService = TestBed.inject(ManufacturersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.manufacturerForm).toBeDefined();
    expect(component.manufacturerForm.get('cnpj')).toBeTruthy();
    expect(component.manufacturerForm.get('nome')).toBeTruthy();
  });

  it('should get address information when cep changes', () => {
    spyOn(cepService, 'getAddress').and.returnValue(of({ logradouro: 'Rua Teste', localidade: 'Cidade Teste', uf: 'RJ', bairro: 'Bairro Teste' }));
    component.manufacturerForm.get('cep')?.setValue('12345678');
    component.getAddressInformation();
    expect(cepService.getAddress).toHaveBeenCalledWith('12345678');
  });

  it('should show error toast if getAddress fails', () => {
    spyOn(cepService, 'getAddress').and.returnValue(throwError(() => new Error('Erro')));
    spyOn(toasterService, 'showToast');
    component.manufacturerForm.get('cep')?.setValue('12345678');
    component.getAddressInformation();
    expect(toasterService.showToast).toHaveBeenCalledWith('Ocorreu um erro ao buscar o CEP', 'error');
  });

  it('should create a manufacturer', () => {
    spyOn(manufacturersService, 'createManufacturer').and.returnValue(of(mockManufacturer));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    component.action = 'create';
    component.createManufacturer();
    expect(toasterService.showToast).toHaveBeenCalledWith('Fabricante cadastrado com sucesso', 'success');
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should edit a manufacturer', () => {
    spyOn(manufacturersService, 'editManufacturer').and.returnValue(of(mockManufacturer));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    component.editManufacturer();
    expect(toasterService.showToast).toHaveBeenCalledWith('Fabricante alterado com sucesso', 'success');
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should handle errors when creating a manufacturer', () => {
    spyOn(manufacturersService, 'createManufacturer').and.returnValue(throwError(() => new Error('Erro')));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    component.createManufacturer();
    expect(toasterService.showToast).toHaveBeenCalledWith('Ocorreu um erro ao cadastrar o fabricante', 'error');
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should handle errors when editing a manufacturer', () => {
    spyOn(manufacturersService, 'editManufacturer').and.returnValue(throwError(() => new Error('Erro')));
    spyOn(toasterService, 'showToast');
    spyOn(loadingService, 'hide');
    component.editManufacturer();
    expect(toasterService.showToast).toHaveBeenCalledWith('Ocorreu um erro ao editar o fabricante', 'error');
    expect(loadingService.hide).toHaveBeenCalled();
  });
});
