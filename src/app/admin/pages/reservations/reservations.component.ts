import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, map, merge, startWith, switchMap } from 'rxjs';
import { RESERVATION_STATUS } from 'src/app/lib/constants';
import { Reservation } from 'src/app/lib/types/Reservation';
import { ReservationsService } from 'src/app/services/reservations.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements AfterViewInit {

  constructor(
    private reservationsService: ReservationsService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  displayedColumns: string[] = ['instance', 'programme', 'user', 'interval', 'status', 'actions'];
  data: ReservationTableEntry[] = [];
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  performedActions: BehaviorSubject<string> = new BehaviorSubject('');

  RESERVATION_STATUS = RESERVATION_STATUS;

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.performedActions).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.reservationsService.findAll({ offset: this.paginator.pageIndex * this.paginator.pageSize, limit: this.paginator.pageSize });
      }),
      map(result => {
        this.isLoadingResults = false;
        this.resultsLength = result.count;
        return result.data;
      })
    ).subscribe(reservations => {
      this.data = reservations.map(reservation => ({ ...reservation, isLoading: false }));
    });
  }

  refreshResults() {
    this.performedActions.next("refresh");
  }

  addReservation() {
    this.router.navigate(['admin', 'slots-lookup']);
  }

  viewReservation(reservation: ReservationTableEntry) {
  }

  checkInReservation(reservationEntry: ReservationTableEntry) {
    reservationEntry.isLoading = true;
    this.reservationsService.checkIn(reservationEntry.id).subscribe((reservation) => {
      if(!reservation) {
        reservationEntry.isLoading = false;
        return;
      }
      this.data = this.data.map(r => r.id == reservation.id ? reservation : r);
      this.snackbar.open("S-a făcut check-in pentru rezervare.");
    });
  }

  checkOutReservation(reservationEntry: ReservationTableEntry) {
    reservationEntry.isLoading = true;
    this.reservationsService.checkOut(reservationEntry.id).subscribe((reservation) => {
      if(!reservation) {
        reservationEntry.isLoading = false;
        return;
      }
      this.data = this.data.map(r => r.id == reservation.id ? reservation : r);
      this.snackbar.open("S-a făcut check-out pentru rezervare.");
    });
  }

  cancelReservation(reservationEntry: ReservationTableEntry) {
    reservationEntry.isLoading = true;
    this.reservationsService.cancel(reservationEntry.id).subscribe((reservation) => {
      if(!reservation) {
        reservationEntry.isLoading = false;
        return;
      }
      this.data = this.data.map(r => r.id == reservation.id ? reservation : r);
      this.snackbar.open("Rezervarea a fost anulată.");
    });
  }

}

type ReservationTableEntry = Reservation & { isLoading?: boolean };
