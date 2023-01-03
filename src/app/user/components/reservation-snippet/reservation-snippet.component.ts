import { Component, Input, OnInit } from '@angular/core';
import { RESERVATION_STATUS } from 'src/app/lib/constants';
import { Reservation } from 'src/app/lib/types/Reservation';

@Component({
  selector: 'app-reservation-snippet',
  templateUrl: './reservation-snippet.component.html',
  styleUrls: ['./reservation-snippet.component.scss']
})
export class ReservationSnippetComponent implements OnInit {

  constructor() { }

  @Input() reservation: Reservation;

  RESERVATION_STATUS = RESERVATION_STATUS;

  ngOnInit(): void {
  }

}
