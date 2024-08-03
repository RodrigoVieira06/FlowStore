import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);


  constructor() { }

  public open(title: string, bodyInfo: string): MatDialogRef<ConfirmDialogComponent, any> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: { title: title, bodyInfo: bodyInfo, confirm: true },
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    })
  }
}
