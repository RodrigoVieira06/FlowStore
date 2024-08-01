import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Manufacturer } from '../../models/manufacturer';

@Component({
  selector: 'app-manufacturers-list-component',
  templateUrl: './manufacturers-list.component.html',
  styleUrl: './manufacturers-list.component.scss'
})
export class ManufacturersListComponent implements OnInit {
  entities: Manufacturer[] = [];
  paginatedUsers: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  showStartEllipsis: boolean = false;
  showEndEllipsis: boolean = false;
  pageSizes: number[] = [5, 10, 25, 100];

  ngOnInit() {
    this.mockData();
    this.updatePagination();
  }

  mockData(): void {
    for (let i = 1; i <= 100; i++) {
      this.entities.push({
        nome: `Fabricante ${i}`,
        cnpj: `123456${i}`,
        logradouro: `teste ${i}`,
        bairro: '',
        cep: '',
        cidade: '',
        complemento: '',
        contato: '',
        contatoTipo: '',
        estado: '',
        id: i,
        numero: ''
      });
    }
  }

  protected updatePagination(): void {
    this.totalPages = Math.ceil(this.entities.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (v, k) => k + 1);
    this.updateVisiblePages();
    this.paginatedUsers = this.entities.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  protected updateVisiblePages(): void {
    this.showStartEllipsis = false;
    this.showEndEllipsis = false;

    if (this.totalPages <= 5) {
      this.visiblePages = this.pages;
    } else {
      if (this.currentPage <= 3) {
        this.visiblePages = [1, 2, 3, 4, 5];
        this.showEndEllipsis = true;
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
          this.currentPage - 2,
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          this.currentPage + 2
        ];
        this.showStartEllipsis = true;
        this.showEndEllipsis = true;
      }
    }
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  changePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = Number(selectElement.value);
    this.currentPage = 1;
    this.updatePagination();
  }
}
