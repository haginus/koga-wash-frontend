import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RESERVATION_STATUS, MACHINE_TYPES, USER_ROLES, isMobile, FLAG_REASONS, PROGRAMME_MATERIAL_KINDS } from 'src/app/lib/constants';
import { Reservation, ReservationStatus } from 'src/app/lib/types/Reservation';
import { User } from 'src/app/lib/types/User';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { ReservationCheckInDialogComponent } from '../reservation-check-in-dialog/reservation-check-in-dialog.component';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private reservationService: ReservationsService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) { }

  isLoading = true;
  isLoadingAction = false;
  reservation: Reservation;
  user: User;

  RESERVATION_STATUS = RESERVATION_STATUS;
  MACHINE_TYPES = MACHINE_TYPES;
  PROGRAMME_MATERIAL_KINDS = PROGRAMME_MATERIAL_KINDS;
  USER_ROLES = USER_ROLES;
  FLAG_REASONS = FLAG_REASONS;

  get startTime() {
    return new Date(this.reservation?.startTime);
  }

  get canCheckIn() {
    return this.reservation?.status === ReservationStatus.PENDING &&
      Math.abs(this.startTime.getTime() - Date.now()) <= 5 * 60 * 1000;
  }

  get canCheckOut() {
    return this.reservation?.status === ReservationStatus.CHECKED_IN;
  }

  get canCancel() {
    return this.reservation?.status === ReservationStatus.PENDING;
  }

  get hasMeta() {
    return this.reservation?.meta !== undefined && Object.keys(this.reservation.meta).length > 0 &&
      (this.reservation.meta.flags ? this.reservation.meta.flags.length > 0 : true);
  }

  ngOnInit(): void {
    this.isLoading = true;
    firstValueFrom(this.auth.userData).then(user => this.user = user);
    this.route.params.subscribe(params => {
      if(!params.id) {
        this.goBack();
        return;
      }
      this.reservationService.findOne(params.id).subscribe(reservation => {
        if(!reservation) {
          this.goBack();
          return;
        }
        this.reservation = reservation;
      });
      this.isLoading = false;
    });
  }

  goBack() {
    this.router.navigate([this.user.role, "reservations"]);
  }

  checkIn() {
    const dialogRef = this.dialog.open<ReservationCheckInDialogComponent, Reservation, Reservation>(ReservationCheckInDialogComponent, { 
      data: this.reservation,
      minWidth: isMobile ? '90vw' : '50vw',
    });
    dialogRef.afterClosed().subscribe(reservation => {
      if(!reservation) return;
      this.reservation = reservation;
    });
  }

  checkOut() {
    this.isLoadingAction = true;
    this.reservationService.checkOut(this.reservation.id).subscribe(reservation => {
      this.isLoadingAction = false;
      if(!reservation) return;
      this.reservation = reservation;
      this.snackbar.open("S-a făcut check-out pentru rezervare.");
    });
  }

  cancel() {
    this.isLoadingAction = true;
    this.reservationService.cancel(this.reservation.id).subscribe(reservation => {
      this.isLoadingAction = false;
      if(!reservation) return;
      this.snackbar.open("Rezervarea a fost anulată.");
      this.reservation = reservation;
    });
  }

}
