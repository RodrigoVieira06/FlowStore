import { Component, OnDestroy, OnInit } from '@angular/core';
import { Manufacturer } from '../../models/manufacturer';
import { ManufacturersService } from '../../services/manufacturers.service';
import { Subscription } from 'rxjs';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { LoadingService } from '../../../../shared/services/loading/loading.service';

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
  public pageSizes: number[] = [10, 25, 100];

  public onError: boolean = false;

  private subscriptions = new Subscription();

  constructor(
    public loadingService: LoadingService,
    private manufacturersService: ManufacturersService,
  ) { }

  ngOnInit() {
    this.getManufacturers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getManufacturers(): void {
    this.loadingService.show();
    const subscription = this.manufacturersService.listManufactures(this.pageSize, this.currentPage)
      .subscribe({
        next: (response: PaginatedResponse<Manufacturer>) => {
          this.pageConfig = response;
          this.entities = response.content;
          this.updatePagination();
        },
        error: (error) => {
          this.onError = true;
        },
        complete: () => this.loadingService.hide()
      })

    this.subscriptions.add(subscription);
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
    this.pageSize = Number(selectElement.value);
    this.currentPage = 0;
    this.getManufacturers();
  }
}
