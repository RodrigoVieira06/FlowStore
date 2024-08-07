import { TestBed } from '@angular/core/testing';

import { ConfirmDialogService } from './confirm-dialog.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a MatDialogRef instance', () => {
    const result = service.open('Title', 'Body');
    expect(result).toBeInstanceOf(MatDialogRef);
  });
});
