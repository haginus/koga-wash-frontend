import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AvailableSlots } from '../lib/types/AvailableSlots';
import { AvailableInstancesDto } from '../lib/types/dto/available-instances.dto';
import { CreateReservationDto } from '../lib/types/dto/create-reservation.dto';
import { Paginated } from '../lib/types/Paginated';
import { Reservation } from '../lib/types/Reservation';
import { AuthService } from './auth.service';
import { ReservationQueryDto } from '../lib/types/dto/reservation-query.dto';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  findAll(opts: ReservationQueryDto): Observable<Paginated<Reservation>> {
    const url = `${environment.apiUrl}/reservations/`;
    return this.http.get<Paginated<Reservation>>(url, { ...this.auth.getPrivateHeaders(), params: { ...opts } }).pipe(
      catchError(this.handleError<Paginated<Reservation>>('findAll', { count: 0, data: [] }))
    );
  }

  findOne(reservationId: string): Observable<Reservation> {
    const url = `${environment.apiUrl}/reservations/${reservationId}`;
    return this.http.get<Reservation>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Reservation>('findOne'))
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

  findPreviousReservation(reservationId: string, flag = false): Observable<Reservation> {
    const url = `${environment.apiUrl}/reservations/${reservationId}/previous?flag=${flag}`;
    return this.http.get<Reservation>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Reservation>('findPreviousReservation'))
    );
  }

  findAvailableInstances(): Observable<AvailableInstancesDto[]> {
    const url = `${environment.apiUrl}/reservations/instances`;
    return this.http.get<AvailableInstancesDto[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<AvailableInstancesDto[]>('findAvailableInstances', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Ceva nu a funcționat.');
      return of(result as T);
    };
  }

}
