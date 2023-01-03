import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation, ReservationStatus } from 'src/app/lib/types/Reservation';
import { ReservationsService } from 'src/app/services/reservations.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  constructor(
    private reservationsService: ReservationsService,
    private router: Router,
  ) { }

  reservations: Reservation[] = [];
  upcomingReservations: Reservation[] = [];
  pastReservations: Reservation[] = [];

  ngOnInit(): void {
    this.reservationsService.findAll({ limit: 10000 }).subscribe(result => {
      this.reservations = result.data;
      const isUpcoming = (reservation: Reservation) => 
        reservation.status === ReservationStatus.PENDING || reservation.status === ReservationStatus.CHECKED_IN;
      this.upcomingReservations = this.reservations.filter(reservation => isUpcoming(reservation));
      this.pastReservations = this.reservations.filter(reservation => !isUpcoming(reservation));
    });
  }

  goToLookup() {
    this.router.navigate(['/user/slots-lookup']);
  }

}
