import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  addressFormGroup: FormGroup;

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
  }

  createGroup() {
    this.addressFormGroup = this.fb.group({
      streetAddress: [''],
      addr2: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      cc: ['', [Validators.required]]

    })
    return this.addressFormGroup;
  }
}
