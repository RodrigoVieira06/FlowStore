import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-manufacturers-form-component',
  templateUrl: './manufacturers-form.component.html',
  styleUrl: './manufacturers-form.component.scss'
})
export class ManufacturersFormComponent {
  manufacturerForm: FormGroup;

  constructor() {
    this.manufacturerForm = new FormGroup({
      cnpj: new FormControl('', [Validators.required, Validators.pattern(/^\d{14}$/)]),
      nome: new FormControl('', Validators.required),
      cep: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]),
      endereco: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      complemento: new FormControl(''),
      cidade: new FormControl(''),
      estado: new FormControl('')
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.manufacturerForm.valid) {
      console.log(this.manufacturerForm.value);
    }
  }
}
