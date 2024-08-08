import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private widthComponent = '250px';
  private enterAnimationDurationComponent = '0ms';
  private exitAnimationDurationComponent = '0ms';

  private readonly dialog = inject(MatDialog);

  constructor() { }

  public open(title: string, bodyInfo: string): MatDialogRef<ConfirmDialogComponent, any> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: { title: title, bodyInfo: bodyInfo, confirm: true },
      width: this.widthComponent,
      enterAnimationDuration: this.enterAnimationDurationComponent,
      exitAnimationDuration: this.exitAnimationDurationComponent,
    })
  }
}
