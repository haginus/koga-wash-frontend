import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Programme } from '../lib/types/Programme';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProgrammesService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  findAll(): Observable<Programme[]> {
    const url = `${environment.apiUrl}/programmes/`;
    return this.http.get<Programme[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Programme[]>('findAll', []))
    );
  }

  create(programme: Omit<Programme, 'id'>): Observable<Programme> {
    const url = `${environment.apiUrl}/programmes/`;
    return this.http.post<Programme>(url, programme, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Programme>('create'))
    );
  }

  update(programme: Programme): Observable<Programme> {
    const url = `${environment.apiUrl}/programmes/${programme.id}/`;
    return this.http.put<Programme>(url, programme, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Programme>('update'))
    );
  }

  delete(programmeId: string): Observable<boolean> {
    const url = `${environment.apiUrl}/programmes/${programmeId}/`;
    return this.http.delete<boolean>(url, this.auth.getPrivateHeaders()).pipe(
      map(() => true),
      catchError(this.handleError<boolean>('delete', false))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Ceva nu a funcționat.');
      return of(result as T);
    };
  }

}
