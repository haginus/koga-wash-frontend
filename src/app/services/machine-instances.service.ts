import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MachineInstance } from '../lib/types/MachineInstance';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MachineInstancesService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  findAll(): Observable<MachineInstance[]> {
    const url = `${environment.apiUrl}/instances/`;
    return this.http.get<MachineInstance[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<MachineInstance[]>('findAll', []))
    );
  }

  create(instance: Omit<MachineInstance, 'id'>): Observable<MachineInstance> {
    const url = `${environment.apiUrl}/instances/`;
    return this.http.post<MachineInstance>(url, instance, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<MachineInstance>('create'))
    );
  }

  update(instance: MachineInstance): Observable<MachineInstance> {
    const url = `${environment.apiUrl}/instances/${instance.id}/`;
    return this.http.put<MachineInstance>(url, instance, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<MachineInstance>('update'))
    );
  }

  delete(instanceId: string): Observable<boolean> {
    const url = `${environment.apiUrl}/instances/${instanceId}/`;
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
