import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AvailableSlots } from '../lib/types/AvailableSlots';
import { CreateReservationDto } from '../lib/types/dto/create-reservation.dto';
import { Programme } from '../lib/types/Programme';
import { Reservation } from '../lib/types/Reservation';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  findAvailableSlots(programmeId: string, since?: Date): Observable<AvailableSlots[]> {
    let url = `${environment.apiUrl}/reservations/available-slots/programme/${programmeId}`;
    if (since) {
      url += `?since=${since.toISOString()}`;
    }
    return this.http.get<AvailableSlots[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<AvailableSlots[]>('findAvailableSlots', []))
    );;
  }

  createReservation(dto: CreateReservationDto): Observable<Reservation> {
    const url = `${environment.apiUrl}/reservations/`;
    return this.http.post<Reservation>(url, dto, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Reservation>('createReservation'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Ceva nu a funcționat.');
      return of(result as T);
    };
  }

}
