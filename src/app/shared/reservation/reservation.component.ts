import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, merge } from 'rxjs';
import { RESERVATION_STATUS, MACHINE_TYPES, USER_ROLES, isMobile, FLAG_REASONS, PROGRAMME_MATERIAL_KINDS } from 'src/app/lib/constants';
import { Reservation, ReservationStatus } from 'src/app/lib/types/Reservation';
import { User } from 'src/app/lib/types/User';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { ReservationCheckInDialogComponent } from '../reservation-check-in-dialog/reservation-check-in-dialog.component';
import { transformValue } from 'src/app/lib/utils';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private reservationService: ReservationsService,
    public usersService: UsersService,
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
  now = Date.now();
  timeoutId: NodeJS.Timeout;
  flagUsers: User[] = [];

  get startTime() {
    return new Date(this.reservation?.startTime);
  }

  get canCheckIn() {
    return this.reservation?.status === ReservationStatus.PENDING &&
      Math.abs(this.startTime.getTime() - this.now) <= 5 * 60 * 1000;
  }

  get canCheckOut() {
    return this.reservation?.status === ReservationStatus.CHECKED_IN;
  }

  get canCancel() {
    return this.reservation?.status === ReservationStatus.PENDING;
  }

  get hasMeta() {
    return this.reservation?.meta !== undefined && Object.keys(this.reservation.meta).length > 0;
  }

  get energyUsageDisplay() {
    const energyUsage = this.reservation?.energyUsage;
    if(!energyUsage) return null;
    return transformValue(energyUsage, [
      { interval: [0, 1000], unit: "W", transform: (v) => v.toFixed(0) },
      { interval: [1000, Infinity], unit: "kW", transform: (v) => (v / 1000).toFixed(2) },
    ]);
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
        Promise.all(reservation.meta.flags.map(flag => firstValueFrom(this.usersService.findOne(flag.flaggedByUserId)))).then(users => {
          this.flagUsers = users;
        });
      });
      this.isLoading = false;
    });
    this.timeoutId = setTimeout(() => {
      this.now = Date.now()
    }, 1000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
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
