import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Student } from '../models/student';

export interface StudentsApi {
  students: Student[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})

export class StudentsService {

  endpoint: string = 'http://rt-student-demo.herokuapp.com/api/Students';
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Basic ${btoa('Students:12345678')}`);

  constructor(private http: HttpClient) { }

  // Add student
  add(data: Student): Observable<any> {
    const API_URL = `${this.endpoint}/`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get students
  get(
    sort: string,
    order: string,
    page: number
  ): Observable<StudentsApi> {
    return this.http.get<StudentsApi>(`${this.endpoint}?page=${page}`, { headers: this.headers });
  }

  // Get student
  getById(id): Observable<any> {
    const API_URL = `${this.endpoint}/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  // Update student
  updateById(id, data): Observable<any> {
    const API_URL = `${this.endpoint}/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Delete student
  deleteById(id): Observable<any> {
    var API_URL = `${this.endpoint}/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
