import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MachineInstance } from 'src/app/lib/types/MachineInstance';
import { Programme } from 'src/app/lib/types/Programme';
import { User } from 'src/app/lib/types/User';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationsService } from 'src/app/services/reservations.service';

@Component({
  selector: 'app-reservation-confirmation-dialog',
  templateUrl: './reservation-confirmation-dialog.component.html',
  styleUrls: ['./reservation-confirmation-dialog.component.scss']
})
export class ReservationConfirmationDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReservationConfirmationDialogData,
    private dialogRef: MatDialogRef<ReservationConfirmationDialogComponent>,
    private snackbar: MatSnackBar,
    private reservationService: ReservationsService,
    private authService: AuthService,
    private router: Router,
  ) { }

  user!: User;
  isLoading = false;

  get programme() {
    return this.data.programme;
  }

  get endDate() {
    const date = new Date(this.data.slot);
    date.setMinutes(date.getMinutes() + this.programme.duration);
    return date;
  }

  ngOnInit(): void {
    this.authService.userData.subscribe(user => {
      this.user = user;
    });
  }

  confirmReservation() {
    this.isLoading = true;
    const sub = this.reservationService.createReservation({
      machineInstanceId: this.data.instance.id,
      programmeId: this.programme.id,
      startTime: this.data.slot,
      userId: this.user.id,
    }).subscribe((reservation) => {
      if(!reservation) {
        this.isLoading = false;
        return;
      }
      if(this.data.instance.machine.kind == 'WashingMachine') {
        const sbRef = this.snackbar.open('Rezervarea a fost efectuată cu succes!', 'Programare uscător', {
          duration: 10000,
        });
        sbRef.onAction().subscribe(() => {
          this.router.navigate([this.user.role, 'slots-lookup'], { 
            queryParams: { 
              since: reservation.endTime,
              type: 'Dryer',
            } 
          });
        });
      } else {
        this.snackbar.open('Rezervarea a fost efectuată cu succes!');
      }
      this.dialogRef.close();
      this.router.navigate([this.user.role, 'reservations', reservation.id]);
      sub.unsubscribe();
    });
  }

}

export interface ReservationConfirmationDialogData {
  instance: MachineInstance;
  programme: Programme;
  slot: string;
}
