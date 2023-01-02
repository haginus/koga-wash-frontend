import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AvailableSlots } from '../lib/types/AvailableSlots';
import { CreateReservationDto } from '../lib/types/dto/create-reservation.dto';
import { Paginated } from '../lib/types/Paginated';
import { PaginatedQuery } from '../lib/types/PaginatedQuery';
import { Reservation } from '../lib/types/Reservation';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  findAll(opts: PaginatedQuery): Observable<Paginated<Reservation>> {
    const url = `${environment.apiUrl}/reservations/`;
    return this.http.get<Paginated<Reservation>>(url, { ...this.auth.getPrivateHeaders(), params: { ...opts } }).pipe(
      catchError(this.handleError<Paginated<Reservation>>('findAll', { count: 0, data: [] }))
    );
  }

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

  checkIn(reservationId: string): Observable<Reservation> {
    const url = `${environment.apiUrl}/reservations/${reservationId}/check-in`;
    return this.http.post<Reservation>(url, {}, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Reservation>('checkIn'))
    );
  }

  checkOut(reservationId: string): Observable<Reservation> {
    const url = `${environment.apiUrl}/reservations/${reservationId}/check-out`;
    return this.http.post<Reservation>(url, {}, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Reservation>('checkOut'))
    );
  }

  cancel(reservationId: string): Observable<Reservation> {
    const url = `${environment.apiUrl}/reservations/${reservationId}/cancel`;
    return this.http.post<Reservation>(url, {}, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Reservation>('cancel'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Ceva nu a funcționat.');
      return of(result as T);
    };
  }

}
