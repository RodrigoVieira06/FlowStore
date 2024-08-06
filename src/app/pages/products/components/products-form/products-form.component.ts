import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, Subscription, switchMap } from 'rxjs';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { ManufacturersService } from '../../../manufacturers/services/manufacturers.service';
import { Manufacturer } from '../../../manufacturers/models/manufacturer';

@Component({
  selector: 'app-products-form-component',
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss'
})
export class ProductsFormComponent {
  public productForm: FormGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    fabricanteID: new FormControl(''),
    codigoBarras: new FormControl('', Validators.required),
    descricao: new FormControl('', Validators.required),
  });

  public fabricanteCNPJ = new FormControl;

  public action: 'create' | 'edit' | 'show' = 'create';

  private subscriptions = new Subscription();

  public manufacturersOptions: Manufacturer[] = [];
  public pageSize = 10;
  public pageIndex = 0;

  constructor(
    private productsService: ProductsService,
    private manufacturersService: ManufacturersService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private toasterService: ToasterService
  ) {
    this.fabricanteCNPJ.setValue('');
    this.fabricanteCNPJ.addValidators(Validators.required);
  }

  ngOnInit(): void {
    this.verifyFormAction();
    this.getManufacturers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onScroll(): void {
    this.pageIndex++;

    this.manufacturersService.searchManufacturersByName(this.productForm.get('fabricanteCNPJ')?.value, this.pageSize, this.pageIndex)
      .subscribe((response: PaginatedResponse<Manufacturer>) => {
        this.manufacturersOptions = [...this.manufacturersOptions, ...response.content];
      });
  }

  public getManufacturers() {
    this.fabricanteCNPJ.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((manufacturer: string) => {
        this.loadingService.show();
        return this.manufacturersService.searchManufacturersByName(manufacturer, this.pageSize, this.pageIndex);
      })
    )
      .subscribe({
        next: (response: PaginatedResponse<Manufacturer>) => {
          this.manufacturersOptions = response.content;
          this.loadingService.hide();
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao buscar os fabricantes', 'error');
          this.loadingService.hide();
        }
      })
  }

  public onSubmit(): void {
    if (!this.productForm.valid) {
      this.toasterService.showToast('Formulário inválido. Por favor, corriga nos campos indicados com erro', 'error');
      return;
    }

    if (this.action === 'create') {
      this.createProduct();
      return;
    }

    this.editProduct();
  }

  public createProduct(): void {
    let subscription: Subscription;

    this.loadingService.show();

    this.productForm.get('fabricanteID')?.setValue(this.fabricanteCNPJ.value);

    subscription = this.productsService.createProduct(this.productForm.value)
      .subscribe({
        next: () => {
          this.toasterService.showToast('Produto cadastrado com sucesso', 'success');
          this.loadingService.hide();
          this.router.navigate(['/products']);
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao cadastrar o produto', 'error');
          this.loadingService.hide();
        }
      });

    this.subscriptions.add(subscription);
  }

  public getProduct(codeBar: string): void {
    this.loadingService.show();

    const subscription = this.productsService.searchProductsByBarcode(codeBar, 1, 0)
      .subscribe({
        next: (response: PaginatedResponse<Product>) => {
          this.setFormData(response.content[0]);
          this.loadingService.hide();
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um  erro ao buscar as informações do produto', 'error');
          this.loadingService.hide();
        }
      });

    this.subscriptions.add(subscription);
  }

  public editProduct(): void {
    let subscription: Subscription;

    this.loadingService.show();
    subscription = this.productsService.editProduct(this.productForm.value)
      .subscribe({
        next: () => {
          this.toasterService.showToast('Produto alterado com sucesso', 'success');
          this.loadingService.hide();
          this.router.navigate(['/products']);
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao editar o produto', 'error');
          this.loadingService.hide();
        }
      });

    this.subscriptions.add(subscription);
  }

  private verifyFormAction(): void {
    const barCode = this.activeRoute.snapshot.paramMap.get('barcode');

    if (!barCode) {
      return;
    }

    const urlSegments: UrlSegment[] = this.activeRoute.snapshot.url;

    this.action = urlSegments[0].path === 'edit' ? 'edit' : 'show';

    this.getProduct(barCode);
  }

  private setFormData(data: Product): void {
    this.productForm.get('nome')?.setValue(data.nome);
    this.productForm.get('fabricanteID')?.setValue(data.fabricante?.id);
    this.fabricanteCNPJ.setValue(data.fabricante?.id);
    this.productForm.get('codigoBarras')?.setValue(data.codigoBarras);
    this.productForm.get('descricao')?.setValue(data.descricao);
  }
}
