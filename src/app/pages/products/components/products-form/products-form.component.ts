import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { ManufacturersService } from '../../../manufacturers/services/manufacturers.service';
import { Manufacturer } from '../../../manufacturers/models/manufacturer';
import { MainEnums } from '../../../../shared/enums/enum';

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

  public fabricanteName = new FormControl;

  public action: 'create' | 'edit' | 'show' = 'create';

  private subscriptions = new Subscription();
  private enums = MainEnums;

  public manufacturersOptions: Manufacturer[] = [];
  public pageSize: number = 10;
  public pageIndex: number = 0;

  constructor(
    private productsService: ProductsService,
    private manufacturersService: ManufacturersService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private toasterService: ToasterService
  ) {
    this.fabricanteName.setValue('');
    this.fabricanteName.addValidators(Validators.required);

    this.pageSize = this.enums.INITIAL_PAGE_SIZE;
    this.pageIndex = this.enums.MAIN_CURRENT_PAGE;
  }

  ngOnInit(): void {
    this.verifyFormAction();
    if (this.action === 'create') {
      this.getManufacturers();
    }
    this.manufacturerChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getManufacturers() {
    if (this.action !== 'create') {
      return;
    }

    this.loadingService.show();
    this.pageIndex++;

    const subscribe = this.manufacturersService.searchManufacturersByName(this.fabricanteName.value, this.pageSize, this.pageIndex)
      .subscribe({
        next: (response: PaginatedResponse<Manufacturer>) => {
          this.manufacturersOptions = response.content;
          this.loadingService.hide();
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao buscar fabricantes', 'error');
          this.loadingService.hide();
        }
      });

    this.subscriptions.add(subscribe);
  }

  public manufacturerChange() {
    const subscribe = this.fabricanteName.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((manufacturer: string | Manufacturer) => {
        this.loadingService.show();
        if (typeof manufacturer === 'string') {
          return this.manufacturersService.searchManufacturersByName(manufacturer, this.pageSize, this.pageIndex);
        }

        return this.manufacturersService.searchManufacturersByName(manufacturer.nome, this.pageSize, this.pageIndex);
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
      });

    this.subscriptions.add(subscribe);
  }

  public onSubmit(): void {
    if (!this.productForm.valid) {
      this.toasterService.showToast('Formulário inválido. Por favor, confira os campos assinalados com erro com erro', 'error');
      return;
    }

    if (this.action === 'create') {
      this.createProduct();
      return;
    }

    this.editProduct();
  }

  public createProduct(): void {
    this.loadingService.show();

    this.productForm.get('fabricanteID')?.setValue(this.fabricanteName.value.id);

    const subscription = this.productsService.createProduct(this.productForm.value)
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

    const subscription = this.productsService.searchProductsByBarcode(codeBar, this.enums.MAIN_PAGE_SIZE, this.enums.MAIN_CURRENT_PAGE)
      .subscribe({
        next: (response: PaginatedResponse<Product>) => {
          this.setFormData(response.content[this.enums.FIRST_CONTENT]);
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

  public verifyFormAction(): void {
    const barCode = this.activeRoute.snapshot.paramMap.get('barcode');

    if (!barCode) {
      return;
    }

    const urlSegments: UrlSegment[] = this.activeRoute.snapshot.url;

    this.action = urlSegments[this.enums.ACTION_URL_SEGMENT].path === 'edit' ? 'edit' : 'show';

    this.getProduct(barCode);
  }

  public setFormData(data: Product): void {
    this.productForm.get('nome')?.setValue(data.nome);
    this.productForm.get('fabricanteID')?.setValue(data.fabricante?.id);
    this.fabricanteName.setValue(data.fabricante);
    this.productForm.get('codigoBarras')?.setValue(data.codigoBarras);
    this.productForm.get('descricao')?.setValue(data.descricao);
  }

  public displayFn(option: Manufacturer): string {
    return option ? option.nome : '';
  }
}
