import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paginated } from '../lib/types/Paginated';
import { PaginatedQuery } from '../lib/types/PaginatedQuery';
import { User } from '../lib/types/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  findAll(options?: PaginatedQuery): Observable<Paginated<User>> {
    const url = `${environment.apiUrl}/users/`;

    return this.http.get<Paginated<User>>(url, { ...this.auth.getPrivateHeaders(), params: { ...options } }).pipe(
      catchError(this.handleError<Paginated<User>>('findAll', { data: [], count: 0 }))
    );
  }

  create(user: User): Observable<User> {
    const url = `${environment.apiUrl}/users/`;
    return this.http.post<User>(url, user, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<User>('create'))
    );
  }

  update(user: User): Observable<User> {
    const url = `${environment.apiUrl}/users/${user.id}`;
    return this.http.put<User>(url, user, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<User>('update'))
    );
  }

  delete(userId: string): Observable<boolean> {
    const url = `${environment.apiUrl}/users/${userId}`;
    return this.http.delete<any>(url, this.auth.getPrivateHeaders()).pipe(
      map(_ => true),
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