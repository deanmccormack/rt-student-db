import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StudentsService } from '../../services/students.service';

import { EmergencyContactFormComponent } from '../emergency-contact-form/emergency-contact-form.component';
import { AddressFormComponent } from '../address-form/address-form.component';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('chipList', { static: true }) chipList;
  @ViewChild('resetStudentForm', { static: true }) myNgForm;
  @ViewChild(EmergencyContactFormComponent, { static: true }) emergencyContactForm: EmergencyContactFormComponent;
  @ViewChild(AddressFormComponent, { static: true }) addressForm: AddressFormComponent;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  studentForm: FormGroup;
  subjectArray: Subject[] = [];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private studentsService: StudentsService
  ) {  }

  ngOnInit() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.studentsService.getById(id).subscribe(data => {
      this.subjectArray = data.classes;
      this.studentForm = this.fb.group({
        firstName: [data.firstName, [Validators.required]],
        lastName: [data.firstName, [Validators.required]],
        phone: [data.phone, [Validators.required]],
        email: [data.email, [Validators.required]],
        classes: [data.classes],
        dob: [data.dob, [Validators.required]],
        emergencyContact: this.emergencyContactForm.createGroup(),
        address: this.addressForm.createGroup(),
      })
    })
  }


  /* Add  */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray = [...this.subjectArray, { name: value.trim() }];
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove */
  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
  }

  /* Date */
  formatDate(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.studentForm.get('dob').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.studentForm.controls[controlName].hasError(errorName);
  }

  submitStudentForm() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.studentsService.updateById(id, this.studentForm.value).subscribe( res => {
      this.ngZone.run(() => this.router.navigateByUrl('/students-list'))
    });
  }

}
