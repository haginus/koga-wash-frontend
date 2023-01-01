import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plug } from '../lib/types/Plug';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlugsService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  findAll(): Observable<Plug[]> {
    const url = `${environment.apiUrl}/plugs/`;
    return this.http.get<Plug[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Plug[]>('findAll', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Ceva nu a funcționat.');
      return of(result as T);
    };
  }

}
