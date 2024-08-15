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
import { Cep } from '../../../../shared/models/cep';

describe('ManufacturersFormComponent', () => {
  let component: ManufacturersFormComponent;
  let fixture: ComponentFixture<ManufacturersFormComponent>;
  let cepService: CepService;
  let loadingService: LoadingService;
  let toasterService: ToasterService;
  let manufacturersService: ManufacturersService;
  const mockManufacturer: Manufacturer = {
    "id": 72,
    "nome": "Teste",
    "cnpj": "47944006000180",
    "cep": "04551010",
    "logradouro": "Rua Fidêncio Ramos",
    "numero": "308",
    "complemento": "1 andar",
    "bairro": "Vila Olímpia",
    "cidade": "São Paulo",
    "estado": "São Paulo",
    "contatoTipo": "Email",
    "contato": "contato@teste.com.br"
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

  it('should show error message if form is invalid', () => {
    spyOn(toasterService, 'showToast');
    component.manufacturerForm.setValue({
      cnpj: '',
      nome: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      contato: '',
      contatoTipo: 'Email'
    });
    component.onSubmit();
    expect(toasterService.showToast).toHaveBeenCalledWith('Formulário inválido. Por favor, confira os campos assinalados com erro', 'error');
  });

  it('should clear address fields', () => {
    component.clearAddressFields();
    expect(component.manufacturerForm.get('logradouro')?.value).toBe('');
    expect(component.manufacturerForm.get('cidade')?.value).toBe('');
    expect(component.manufacturerForm.get('estado')?.value).toBe('');
    expect(component.manufacturerForm.get('bairro')?.value).toBe('');
    expect(component.manufacturerForm.get('numero')?.value).toBe('');
    expect(component.manufacturerForm.get('complemento')?.value).toBe('');
  });

  it('should fill in address fields', () => {
    const cepResponse: Cep = {
      cep: '12345678',
      logradouro: 'Rua Teste',
      bairro: 'Bairro Teste',
      localidade: 'Cidade Teste',
      uf: 'UF'
    };
    component.fillInAddressFields(cepResponse);
    expect(component.manufacturerForm.get('logradouro')?.value).toBe('Rua Teste');
    expect(component.manufacturerForm.get('cidade')?.value).toBe('Cidade Teste');
    expect(component.manufacturerForm.get('estado')?.value).toBe('UF');
    expect(component.manufacturerForm.get('bairro')?.value).toBe('Bairro Teste');
  });

  it('should set form data from Manufacturer object', () => {
    const manufacturer: Manufacturer = {
      cnpj: '12345678000195',
      nome: 'Manufacturer Teste',
      cep: '12345678',
      logradouro: 'Rua Teste',
      numero: '123',
      complemento: '',
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'UF',
      contato: 'contact@test.com',
      contatoTipo: 'Email',
      id: 1
    };
    component.setFormData(manufacturer);
    expect(component.manufacturerForm.get('cnpj')?.value).toBe('12345678000195');
    expect(component.manufacturerForm.get('nome')?.value).toBe('Manufacturer Teste');
  });
});
