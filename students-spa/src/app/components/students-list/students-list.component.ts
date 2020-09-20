import { HttpClient } from "@angular/common/http";
import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { Router } from '@angular/router';

import { Student } from '../../models/student';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})

export class StudentsListComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'edit', 'delete'];
  data: Student[] = [];
  dataSource = new MatTableDataSource([]);//MatTableDataSource<Student>;

  totalStudents = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private studentService: StudentsService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    // reset to first page - onchange.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.studentService!.get(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex
          );
        }),
        map(data => {
          // loading finished.
          this.isLoadingResults = false;
          this.totalStudents = data.totalCount;
          return data.students;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.data = data));
  }

  editStudent(id: string) {
    this.router.navigateByUrl(`/edit-student/${id}`);
  }

  deleteStudent(id: string) {
    if(window.confirm('Are you sure')) {
      this.studentService.deleteById(id).subscribe((x) => console.log(x));
      // FIXME: this is wrong but does cause a refresh
      this.paginator._changePageSize(this.paginator.pageSize);
    }
  }

}
