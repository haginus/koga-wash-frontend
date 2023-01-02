import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RESERVATION_STATUS, MACHINE_TYPES, USER_ROLES } from 'src/app/lib/constants';
import { Reservation, ReservationStatus } from 'src/app/lib/types/Reservation';
import { User } from 'src/app/lib/types/User';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationsService } from 'src/app/services/reservations.service';

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
  ) { }

  isLoading = true;
  reservation: Reservation;
  user: User;

  RESERVATION_STATUS = RESERVATION_STATUS;
  MACHINE_TYPES = MACHINE_TYPES;
  USER_ROLES = USER_ROLES;

  get startTime() {
    return new Date(this.reservation?.startTime);
  }

  get canCheckIn() {
    return this.reservation?.status === ReservationStatus.PENDING &&
      Math.abs(this.startTime.getTime() - Date.now()) <= 5 * 60 * 1000;
  }

  get canCancel() {
    return this.reservation?.status === ReservationStatus.PENDING;
  }

  get hasMeta() {
    return this.reservation?.meta !== undefined && Object.keys(this.reservation.meta).length > 0;
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

  }

  cancel() {

  }

}
