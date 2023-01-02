import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Reservation } from 'src/app/lib/types/Reservation';
import { ReservationsService } from 'src/app/services/reservations.service';

@Component({
  selector: 'app-reservation-check-in-dialog',
  templateUrl: './reservation-check-in-dialog.component.html',
  styleUrls: ['./reservation-check-in-dialog.component.scss']
})
export class ReservationCheckInDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public reservation: Reservation,
    private dialogRef: MatDialogRef<ReservationCheckInDialogComponent>,
    private snackbar: MatSnackBar,
    public reservationService: ReservationsService,
  ) { }

  isCheckingIn = false;
  previousReservation: Reservation;
  isLoadingPreviousReservation = false;

  ngOnInit(): void {
    
  }

  getPreviousReservation() {
    if(this.previousReservation !== undefined) return;
    this.isLoadingPreviousReservation = true;
    this.reservationService.findPreviousReservation(this.reservation.id, true).subscribe(reservation => {
      this.isLoadingPreviousReservation = false;
      if(!reservation) {
        this.snackbar.open('Nu există o rezervare anterioară.');
        this.previousReservation = null;
        return;
      }
      this.previousReservation = reservation;
    });
  }

  checkIn() {
    this.isCheckingIn = true;
    this.reservationService.checkIn(this.reservation.id).subscribe((reservation) => {
      this.isCheckingIn = false;
      if(!reservation) return;
      this.dialogRef.close(reservation);
      this.snackbar.open('S-a făcut check-in.');
    });
  }

}
