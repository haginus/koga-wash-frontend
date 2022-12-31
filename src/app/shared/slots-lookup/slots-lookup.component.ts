import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MACHINE_TYPES } from 'src/app/lib/constants';
import { AvailableSlots } from 'src/app/lib/types/AvailableSlots';
import { MachineInstance } from 'src/app/lib/types/MachineInstance';
import { ProgrammesService } from 'src/app/services/programmes.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { ReservationConfirmationDialogComponent, ReservationConfirmationDialogData } from '../reservation-confirmation-dialog/reservation-confirmation-dialog.component';

@Component({
  selector: 'app-slots-lookup',
  templateUrl: './slots-lookup.component.html',
  styleUrls: ['./slots-lookup.component.scss']
})
export class SlotsLookupComponent implements OnInit {

  constructor(
    private programmesService: ProgrammesService, 
    private reservationsService: ReservationsService,
    private dialog: MatDialog,
  ) {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 3);
  }

  minDate = new Date();
  maxDate = new Date();

  lookupForm = new FormGroup({
    programme: new FormControl(null, [Validators.required]),
    since: new FormControl(new Date(), [Validators.required]),
  });

  programmes$ = this.programmesService.findAll();
  availableSlots: AvailableSlots[] = [];
  narrowedAvailableSlots: NarrowedAvailableSlots[] = [];
  availableSlotsSubscription: Subscription;
  isLoading = false;

  MACHINE_TYPES = MACHINE_TYPES;
  MAX_SLOTS = 9;

  ngOnInit(): void {
  }

  searchSlots() {
    this.isLoading = true;
    const { programme, since } = this.lookupForm.value;
    this.availableSlotsSubscription = this.reservationsService.findAvailableSlots(programme.id, since).subscribe((slots) => {
      this.availableSlots = slots;
      this.isLoading = false;
      this.narrowedAvailableSlots = this.availableSlots.map((availableSlot) => {
        return {
          ...availableSlot,
          allSlots: availableSlot.slots,
          slots: availableSlot.slots.slice(0, this.MAX_SLOTS),
        };
      });
    });
  }

  selectSlot(instance: MachineInstance, slot: string) {
    const { programme } = this.lookupForm.value;
    this.dialog.open<ReservationConfirmationDialogComponent, ReservationConfirmationDialogData>(ReservationConfirmationDialogComponent, {
      data: {
        instance,
        slot,
        programme: programme,
      },
      minWidth: '50%'
    });
  }

  expandSlots(slotWrapper: NarrowedAvailableSlots) {
    slotWrapper.slots = slotWrapper.allSlots;
  }

}

interface NarrowedAvailableSlots extends AvailableSlots {
  allSlots: string[];
}
