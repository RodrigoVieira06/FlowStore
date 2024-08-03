import { Component, inject, model, ModelSignal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly title: ModelSignal<boolean> = model(this.data.title);
  readonly bodyInfo: ModelSignal<boolean> = model(this.data.bodyInfo);
  readonly confirm: ModelSignal<boolean> = model(this.data.confirm);
}
