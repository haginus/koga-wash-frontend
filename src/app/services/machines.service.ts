import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Machine } from '../lib/types/Machine';
import { Programme } from '../lib/types/Programme';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MachinesService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  findAll(): Observable<Machine[]> {
    const url = `${environment.apiUrl}/machines/`;
    return this.http.get<Machine[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Machine[]>('findAll', []))
    );
  }

  findOne(id: string): Observable<Machine> {
    const url = `${environment.apiUrl}/machines/${id}`;
    return this.http.get<Machine>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Machine>('findOne'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Ceva nu a funcționat.');
      return of(result as T);
    };
  }

}
