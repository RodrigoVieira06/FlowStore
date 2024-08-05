import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CepService } from '../../../../shared/services/cep/cep.service';
import { Cep } from '../../../../shared/models/cep';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { ManufacturersService } from '../../services/manufacturers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { Manufacturer } from '../../models/manufacturer';

@Component({
  selector: 'app-manufacturers-form-component',
  templateUrl: './manufacturers-form.component.html',
  styleUrl: './manufacturers-form.component.scss'
})
export class ManufacturersFormComponent implements OnInit, OnDestroy {
  public manufacturerForm: FormGroup = new FormGroup({
    cnpj: new FormControl('', [Validators.required, Validators.pattern(/^(\d{3})\.?(\d{3})\.?(\d{3})\-?(\d{2}$)$|^(\d{2})\.?(\d{3})\.?(\d{3})\/?([0-1]{4})\-?(\d{2})$/)]),
    nome: new FormControl('', Validators.required),
    cep: new FormControl('', [Validators.required, Validators.pattern(/^\d{8}$/)]),
    logradouro: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    complemento: new FormControl(''),
    bairro: new FormControl(''),
    cidade: new FormControl(''),
    estado: new FormControl(''),
    contato: new FormControl('', [Validators.email, Validators.required]),
    contatoTipo: new FormControl('Email')
  });

  public action: 'create' | 'edit' = 'create';

  private subscriptions = new Subscription();

  constructor(
    private manufacturersService: ManufacturersService,
    private cepService: CepService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private toasterService: ToasterService
  ) {
    this.verifyIsEditForm();
  }

  ngOnInit(): void {
    this.getAddressInformation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getAddressInformation(): void {
    const subscription = this.manufacturerForm.get('cep')?.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(value => {
        this.clearAddressFields()
        if (value.length === 8) {
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

    const subscription = this.manufacturersService.searchManufacturersByCNPJ(1, 1, cnpj)
      .subscribe({
        next: (response: PaginatedResponse<Manufacturer>) => {
          this.setFormData(response.content[0]);
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
    let subscription: Subscription;

    this.loadingService.show();
    subscription = this.manufacturersService.createManufacturer(this.manufacturerForm.value)
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
    let subscription: Subscription;

    this.loadingService.show();
    subscription = this.manufacturersService.editManufacturer(this.manufacturerForm.value)
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
      this.toasterService.showToast('Formulário inválido. Por favor, corriga nos campos indicados', 'error');
      return;
    }

    if (this.action === 'create') {
      this.createManufacturer()
      return;
    }

    this.editManufacturer();
  }

  private clearAddressFields(): void {
    this.manufacturerForm.get('logradouro')?.setValue('');
    this.manufacturerForm.get('cidade')?.setValue('');
    this.manufacturerForm.get('estado')?.setValue('');
    this.manufacturerForm.get('bairro')?.setValue('');
  }

  private fillInAddressFields(values: Cep): void {
    this.manufacturerForm.get('logradouro')?.setValue(values.logradouro);
    this.manufacturerForm.get('cidade')?.setValue(values.localidade);
    this.manufacturerForm.get('estado')?.setValue(values.uf);
    this.manufacturerForm.get('bairro')?.setValue(values.bairro);
  }

  private verifyIsEditForm(): void {
    const cnpj = this.activeRoute.snapshot.paramMap.get('cnpj');
    if (cnpj) {
      this.action = 'edit';
      this.getManufacturer(cnpj);
    }
  }

  private setFormData(data: Manufacturer): void {
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
