import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CepService } from '../../../../shared/services/cep/cep.service';
import { Cep } from '../../../../shared/models/cep';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { ManufacturersService } from '../../services/manufacturers.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { Manufacturer } from '../../models/manufacturer';
import { cepValidator, cnpjValidator } from '../../../../shared/utils/validators';
import { MainEnums } from '../../../../shared/enums/enum';

@Component({
  selector: 'app-manufacturers-form-component',
  templateUrl: './manufacturers-form.component.html',
  styleUrl: './manufacturers-form.component.scss'
})
export class ManufacturersFormComponent implements OnInit, OnDestroy {
  public manufacturerForm: FormGroup = new FormGroup({
    cnpj: new FormControl('', [Validators.required, Validators.pattern(cnpjValidator())]),
    nome: new FormControl('', Validators.required),
    cep: new FormControl('', [Validators.required, Validators.pattern(cepValidator())]),
    logradouro: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    complemento: new FormControl(''),
    bairro: new FormControl(''),
    cidade: new FormControl(''),
    estado: new FormControl(''),
    contato: new FormControl('', [Validators.email, Validators.required]),
    contatoTipo: new FormControl('Email')
  });

  public action: 'create' | 'edit' | 'show' = 'create';

  private subscriptions = new Subscription();
  private enums = MainEnums;

  constructor(
    private manufacturersService: ManufacturersService,
    private cepService: CepService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private toasterService: ToasterService
  ) {
    this.verifyFormAction();
  }

  ngOnInit(): void {
    this.getAddressInformation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getAddressInformation(): void {
    if (this.action === 'show') {
      return;
    }

    const subscription = this.manufacturerForm.get('cep')?.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(value => {
        this.clearAddressFields()
        if (value.length === this.enums.CEP_LENGTH) {
          this.loadingService.show();
          return this.cepService.getAddress(value);
        }
        return [];
      })
    )
      .subscribe({
        next: (response: Cep) => {
          if (response.erro === "true") {
            this.toasterService.showToast('Não foi possível localizar o CEP informado', 'error');
          } else {
            this.fillInAddressFields(response);
          }
          this.loadingService.hide();
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao buscar o CEP', 'error');
          this.loadingService.hide();
        }
      });

    this.subscriptions.add(subscription);
  }

  public getManufacturer(cnpj: string): void {
    this.loadingService.show();

    const subscription = this.manufacturersService.searchManufacturersByCNPJ(cnpj, this.enums.MAIN_PAGE_SIZE, this.enums.MAIN_CURRENT_PAGE)
      .subscribe({
        next: (response: PaginatedResponse<Manufacturer>) => {
          this.setFormData(response.content[this.enums.FIRST_CONTENT]);
          this.loadingService.hide();
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um  erro ao buscar as informações do fabricante', 'error');
          this.loadingService.hide();
        }
      });

    this.subscriptions.add(subscription);
  }

  public createManufacturer(): void {
    this.loadingService.show();

    const subscription = this.manufacturersService.createManufacturer(this.manufacturerForm.value)
      .subscribe({
        next: () => {
          this.toasterService.showToast('Fabricante cadastrado com sucesso', 'success');
          this.loadingService.hide();
          this.router.navigate(['/manufacturers']);
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao cadastrar o fabricante', 'error');
          this.loadingService.hide();
        }
      });

    this.subscriptions.add(subscription);
  }

  public editManufacturer(): void {
    this.loadingService.show();

    const subscription = this.manufacturersService.editManufacturer(this.manufacturerForm.value)
      .subscribe({
        next: () => {
          this.toasterService.showToast('Fabricante alterado com sucesso', 'success');
          this.loadingService.hide();
          this.router.navigate(['/manufacturers']);
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao editar o fabricante', 'error');
          this.loadingService.hide();
        }
      });

    this.subscriptions.add(subscription);
  }

  public onSubmit(): void {
    if (!this.manufacturerForm.valid) {
      this.toasterService.showToast('Formulário inválido. Por favor, confira os campos assinalados com erro', 'error');
      return;
    }

    if (this.action === 'create') {
      this.createManufacturer()
      return;
    }

    this.editManufacturer();
  }

  public clearAddressFields(): void {
    this.manufacturerForm.get('logradouro')?.setValue('');
    this.manufacturerForm.get('cidade')?.setValue('');
    this.manufacturerForm.get('estado')?.setValue('');
    this.manufacturerForm.get('bairro')?.setValue('');
    this.manufacturerForm.get('numero')?.setValue('');
    this.manufacturerForm.get('complemento')?.setValue('');
  }

  public fillInAddressFields(values: Cep): void {
    this.manufacturerForm.get('logradouro')?.setValue(values.logradouro);
    this.manufacturerForm.get('cidade')?.setValue(values.localidade);
    this.manufacturerForm.get('estado')?.setValue(values.uf);
    this.manufacturerForm.get('bairro')?.setValue(values.bairro);
  }

  public verifyFormAction(): void {
    const cnpj = this.activeRoute.snapshot.paramMap.get('cnpj');

    if (!cnpj) {
      return;
    }

    const urlSegments: UrlSegment[] = this.activeRoute.snapshot.url;

    this.action = urlSegments[0].path === 'edit' ? 'edit' : 'show';

    this.getManufacturer(cnpj);
  }

  public setFormData(data: Manufacturer): void {
    this.manufacturerForm.get('cnpj')?.setValue(data.cnpj);
    this.manufacturerForm.get('nome')?.setValue(data.nome);
    this.manufacturerForm.get('cep')?.setValue(data.cep);
    this.manufacturerForm.get('logradouro')?.setValue(data.logradouro);
    this.manufacturerForm.get('numero')?.setValue(data.numero);
    this.manufacturerForm.get('complemento')?.setValue(data.complemento);
    this.manufacturerForm.get('bairro')?.setValue(data.bairro);
    this.manufacturerForm.get('cidade')?.setValue(data.cidade);
    this.manufacturerForm.get('estado')?.setValue(data.estado);
    this.manufacturerForm.get('contato')?.setValue(data.contato);
    this.manufacturerForm.get('contatoTipo')?.setValue(data.contatoTipo);
  }
}
