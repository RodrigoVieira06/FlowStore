import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CepService } from '../../../../shared/services/cep/cep.service';
import { Cep } from '../../../../shared/models/cep';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { ManufacturersService } from '../../services/manufacturers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manufacturers-form-component',
  templateUrl: './manufacturers-form.component.html',
  styleUrl: './manufacturers-form.component.scss'
})
export class ManufacturersFormComponent implements OnInit, OnDestroy {
  public manufacturerForm: FormGroup;

  private subscriptions = new Subscription();

  constructor(
    private manufacturersService: ManufacturersService,
    private cepService: CepService,
    private router: Router,
    private loadingService: LoadingService,
    private toasterService: ToasterService
  ) {
    this.manufacturerForm = new FormGroup({
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

  public onSubmit(): void {
    let subscription: Subscription;

    if (this.manufacturerForm.valid) {
      this.loadingService.show();
      subscription = this.manufacturersService.createManufacturers(this.manufacturerForm.value)
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
        })
    } else {
      this.toasterService.showToast('Formulário inválido. Por favor, corriga nos campos indicados', 'error');
    }
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
}
