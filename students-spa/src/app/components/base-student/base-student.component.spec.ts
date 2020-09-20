import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseStudentComponent } from './base-student.component';

describe('BaseStudentComponent', () => {
  let component: BaseStudentComponent;
  let fixture: ComponentFixture<BaseStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
