import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { FormControl } from '@angular/forms';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list-component',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  public entities: Product[] = [];

  public pageConfig?: PaginatedResponse<Product>;
  public currentPage: number = 0;
  public pageSize: number = 10;
  public totalPages: number = 0;
  public pages: number[] = [];
  public visiblePages: number[] = [];
  public showStartEllipsis: boolean = false;
  public showEndEllipsis: boolean = false;
  public pageSizes: number[] = [10, 25, 50];

  public searchControl = new FormControl();
  public orderBy: string = '';

  private subscriptions = new Subscription();

  constructor(
    private loadingService: LoadingService,
    private productsService: ProductsService,
    private confirmDialogService: ConfirmDialogService,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProducts();
    this.searchProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getProducts(): void {
    this.loadingService.show();

    const subscription = this.productsService.getProducts(this.pageSize, this.currentPage)
      .subscribe({
        next: (response: PaginatedResponse<Product>) => {
          this.updatecomponent(response);
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao listar os produtos', 'error');
        },
        complete: () => this.loadingService.hide()
      });

    this.subscriptions.add(subscription);
  }

  public searchProducts(): void {
    const subscription = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string) => {
        this.loadingService.show();
        if (!value) {
          return this.productsService.getProducts(this.pageSize, this.currentPage);
        }
        return this.productsService.searchProductsByBarcode(value, this.pageSize, this.currentPage);
      })
    )
      .subscribe({
        next: (response: PaginatedResponse<Product>) => {
          this.updatecomponent(response);
          this.loadingService.hide();
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao buscar os produtos', 'error');
          this.loadingService.hide();
        }
      })

    this.subscriptions.add(subscription);
  }

  public showProduct(barcode: string): void {
    this.router.navigate(['/products/show', barcode]);
  }

  public editProduct(barcode: string): void {
    this.router.navigate(['/products/edit', barcode]);
  }

  public deleteProducts(id: string, product: string): void {
    this.loadingService.show();

    const subscription = this.productsService.deleteProduct(id)
      .subscribe(
        {
          next: () => {
            this.currentPage = 0;
            this.getProducts();
            this.loadingService.hide()
            this.toasterService.showToast(`O produto ${product} foi deletado com sucesso`, 'success');
          },
          error: () => {
            this.loadingService.hide()
            this.toasterService.showToast(`Ocorreu um erro ao tentar deletar o produto ${product}`, 'error');
          }
        });

    this.subscriptions.add(subscription);
  }

  public openDeleteProductsDialog(product: Product) {
    const title: string = 'Deletar produto';
    const bodyInfo: string = `Gostaria de apagar o produto ${product.nome}?`;

    const dialogRef = this.confirmDialogService.open(title, bodyInfo);

    const subscribe = dialogRef.afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.deleteProducts(product.id!.toString(), product.nome);
        }
      });

    this.subscriptions.add(subscribe);
  }

  public updatecomponent(response: PaginatedResponse<Product>): void {
    this.pageConfig = response;
    this.entities = response.content;
    this.updatePagination();
  }

  public updatePagination(): void {
    this.totalPages = this.pageConfig!.totalPages;
    this.pages = Array.from({ length: this.totalPages }, (v, k) => k + 1);
    this.updateVisiblePages();

  }

  public updateVisiblePages(): void {
    this.showStartEllipsis = false;
    this.showEndEllipsis = false;

    if (this.totalPages <= 5) {
      this.visiblePages = this.pages;
    } else {
      if (this.currentPage <= 3) {
        this.visiblePages = [1, 2, 3, 4, 5];
        if (this.totalPages > 6) {
          this.showEndEllipsis = true;
        }
      } else if (this.currentPage > this.totalPages - 3) {
        this.visiblePages = [
          this.totalPages - 4,
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages
        ];
        this.showStartEllipsis = true;
      } else {
        this.visiblePages = [
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          this.currentPage + 2,
          this.currentPage + 3
        ];
        this.showStartEllipsis = true;
        this.showEndEllipsis = true;
      }
    }
  }

  public goToPage(page: number): void {
    if (page === (this.currentPage + 1)) {
      return;
    }
    this.currentPage = (page - 1);
    this.getProducts();
  }

  public prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getProducts();
    }
  }

  public nextPage() {
    if (this.currentPage < (this.totalPages - 1)) {
      this.currentPage++;
      this.getProducts();
    }
  }

  public changePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.searchControl.setValue('');
    this.pageSize = Number(selectElement.value);
    this.currentPage = 0;
    this.getProducts();
  }
}
