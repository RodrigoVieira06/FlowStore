import { Component, OnDestroy, OnInit } from '@angular/core';
import { Manufacturer } from '../../models/manufacturer';
import { ManufacturersService } from '../../services/manufacturers.service';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { FormControl } from '@angular/forms';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { isInteger } from '../../../../shared/utils/utils';
import { ToasterService } from '../../../../shared/services/toaster/toaster.service';
import { formatCnpj } from '../../../../shared/utils/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manufacturers-list-component',
  templateUrl: './manufacturers-list.component.html',
  styleUrl: './manufacturers-list.component.scss'
})
export class ManufacturersListComponent implements OnInit, OnDestroy {
  public entities: Manufacturer[] = [];

  public pageConfig?: PaginatedResponse<Manufacturer>;
  public currentPage: number = 0;
  public pageSize: number = 10;
  public totalPages: number = 0;
  public pages: number[] = [];
  public visiblePages: number[] = [];
  public showStartEllipsis: boolean = false;
  public showEndEllipsis: boolean = false;
  public pageSizes: number[] = [10, 25, 50];

  public searchControl = new FormControl();

  private subscriptions = new Subscription();

  constructor(
    private loadingService: LoadingService,
    private manufacturersService: ManufacturersService,
    private confirmDialogService: ConfirmDialogService,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getManufacturers();
    this.searchManufacturers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getManufacturers(): void {
    this.loadingService.show();

    const subscription = this.manufacturersService.getManufacturers(this.pageSize, this.currentPage)
      .subscribe({
        next: (response: PaginatedResponse<Manufacturer>) => {
          this.updatecomponent(response);
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao listar os fabricantes', 'error');
        },
        complete: () => this.loadingService.hide()
      });

    this.subscriptions.add(subscription);
  }

  public searchManufacturers(): void {
    const subscription = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string) => {
        this.loadingService.show();
        if (!value) {
          return this.manufacturersService.getManufacturers(this.pageSize, this.currentPage);
        }

        if (value.length === 14 && isInteger(value)) {
          return this.manufacturersService.searchManufacturersByCNPJ(value, this.pageSize, this.currentPage);
        }

        return this.manufacturersService.searchManufacturersByName(value, this.pageSize, this.currentPage);
      })
    )
      .subscribe({
        next: (response: PaginatedResponse<Manufacturer>) => {
          this.updatecomponent(response);
          this.loadingService.hide();
        },
        error: () => {
          this.toasterService.showToast('Ocorreu um erro ao buscar os fabricantes', 'error');
          this.loadingService.hide();
        }
      })

    this.subscriptions.add(subscription);
  }

  public editManufacturer(cnpj: string): void {
    this.router.navigate(['/manufacturers/edit', cnpj]);
  }

  public deleteManufacturers(id: string, manufacturer: string): void {
    this.loadingService.show();

    const subscription = this.manufacturersService.deleteManufacturer(id)
      .subscribe(
        {
          next: () => {
            this.currentPage = 0;
            this.getManufacturers();
            this.loadingService.hide()
            this.toasterService.showToast(`O fabricante ${manufacturer} foi deletado com sucesso`, 'success');
          },
          error: () => {
            this.loadingService.hide()
            this.toasterService.showToast(`Ocorreu um erro ao tentar deletar o fabricante ${manufacturer}`, 'error');
          }
        });

    this.subscriptions.add(subscription);
  }

  public openDeleteManufacturersDialog(manufacturer: Manufacturer) {
    const title: string = 'Deletar fabricante';
    const bodyInfo: string = `Gostaria de apagar o fabricante ${manufacturer.nome}?`;

    const dialogRef = this.confirmDialogService.open(title, bodyInfo);

    const subscribe = dialogRef.afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.deleteManufacturers(manufacturer.id.toString(), manufacturer.nome);
        }
      });

    this.subscriptions.add(subscribe);
  }

  public updatecomponent(response: PaginatedResponse<Manufacturer>): void {
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
    this.getManufacturers();
  }

  public prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getManufacturers();
    }
  }

  public nextPage() {
    if (this.currentPage < (this.totalPages - 1)) {
      this.currentPage++;
      this.getManufacturers();
    }
  }

  public changePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.searchControl.setValue('');
    this.pageSize = Number(selectElement.value);
    this.currentPage = 0;
    this.getManufacturers();
  }

  public formatCnpj(cnpj: string): string {
    return formatCnpj(cnpj);
  }
}
