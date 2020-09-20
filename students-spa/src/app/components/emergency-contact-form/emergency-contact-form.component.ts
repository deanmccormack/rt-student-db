import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-emergency-contact-form',
  templateUrl: './emergency-contact-form.component.html',
  styleUrls: ['./emergency-contact-form.component.css']
})
export class EmergencyContactFormComponent implements OnInit {
  emergencyContactFormGroup: FormGroup;

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
  }

  createGroup() {
    this.emergencyContactFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      num: ['', [Validators.required]],
    })
    return this.emergencyContactFormGroup;
  }
}
