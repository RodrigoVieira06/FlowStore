import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
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
    fabricanteCNPJ: new FormControl('', Validators.required),
    codigoBarras: new FormControl('', Validators.required),
    descricao: new FormControl('', Validators.required),
  });

  public action: 'create' | 'edit' | 'show' = 'create';

  private subscriptions = new Subscription();

  constructor(
    private productsService: ProductsService,
    private manufacturersService: ManufacturersService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.verifyFormAction();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onSubmit(): void {
    if (!this.productForm.valid) {
      this.toasterService.showToast('Formulário inválido. Por favor, corriga nos campos indicados com erro', 'error');
      return;
    }

    if (this.action === 'create') {
      this.verifyManufacturer();
      return;
    }

    this.editProduct();
  }

  public verifyManufacturer(): void {
    this.loadingService.show();

    const cnpj = this.productForm.get('fabricanteCNPJ')?.value;
    const subscription = this.manufacturersService.searchManufacturersByCNPJ(cnpj, 1, 0)
      .subscribe({
        next: (response: PaginatedResponse<Manufacturer>) => {
          if (response.content.length === 0) {
            this.toasterService.showToast('Não foi possível encontrar o fabricante. Por favor, verifique o CNPJ fornecido', 'error');
            return;
          }

          this.createProduct(response.content[0].id);
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao buscar o fabricante pelo CNPJ fornecido', 'error');
          this.loadingService.hide();
        },
        complete: () => this.loadingService.hide()
      });

    this.subscriptions.add(subscription);
  }

  public createProduct(manufacturerID: number): void {
    let subscription: Subscription;

    this.loadingService.show();
    const product = this.getProductObject(manufacturerID);

    subscription = this.productsService.createProduct(product)
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
    this.productForm.get('fabricanteCNPJ')?.setValue(data.fabricante?.cnpj);
    this.productForm.get('codigoBarras')?.setValue(data.codigoBarras);
    this.productForm.get('descricao')?.setValue(data.descricao);
  }

  private getProductObject(manufacturerID: number): Product {
    const product: Product = {
      nome: this.productForm.get('nome')?.value,
      fabricanteID: manufacturerID,
      codigoBarras: this.productForm.get('codigoBarras')?.value,
      descricao: this.productForm.get('descricao')?.value
    };

    return product;
  }
}
