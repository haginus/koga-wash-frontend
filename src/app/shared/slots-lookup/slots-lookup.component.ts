import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { MACHINE_TYPES } from 'src/app/lib/constants';
import { AvailableSlots } from 'src/app/lib/types/AvailableSlots';
import { MachineInstance } from 'src/app/lib/types/MachineInstance';
import { Programme } from 'src/app/lib/types/Programme';
import { roundToNearest10, stripTime } from 'src/app/lib/utils';
import { ProgrammesService } from 'src/app/services/programmes.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { ReservationConfirmationDialogComponent, ReservationConfirmationDialogData } from '../reservation-confirmation-dialog/reservation-confirmation-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/lib/types/User';

@Component({
  selector: 'app-slots-lookup',
  templateUrl: './slots-lookup.component.html',
  styleUrls: ['./slots-lookup.component.scss']
})
export class SlotsLookupComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private programmesService: ProgrammesService, 
    private reservationsService: ReservationsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.maxDate = roundToNearest10();
    this.maxDate.setDate(this.maxDate.getDate() + 3);
  }

  minDate = roundToNearest10();
  maxDate: Date;
  timeSteps: Date[] = [];
  user: User;

  get userIsSuspened() {
    return this.user?.suspendedUntil !== null && new Date(this.user.suspendedUntil) > new Date();
  }

  lookupForm = new FormGroup({
    machineKind: new FormControl('WashingMachine', [Validators.required]),
    programme: new FormControl(null, [Validators.required]),
    since: new FormControl(roundToNearest10(), [Validators.required]),
  });

  programmes: Programme[] = [];
  filteredProgrammes: Programme[] = [];
  availableSlots: AvailableSlots[] = [];
  narrowedAvailableSlots: NarrowedAvailableSlots[] = [];
  availableSlotsSubscription: Subscription;
  isLoading = false;

  MACHINE_TYPES = MACHINE_TYPES;
  MAX_SLOTS = 9;

  get since() {
    return this.lookupForm.get('since');
  }

  get machineKind() {
    return this.lookupForm.get('machineKind');
  }

  ngOnInit(): void {
    this.calculateTimeSteps(this.since.value);
    this.authService.userData.subscribe((user) => {
      this.user = user;
    });
    this.since.valueChanges.subscribe((value) => {
      if(value < this.minDate) {
        this.since.setValue(this.minDate);
        return;
      }
      if(stripTime(value).getTime() === stripTime(this.timeSteps[0]).getTime()) return;
      this.calculateTimeSteps(value);
    });
    firstValueFrom(this.programmesService.findAll()).then((programmes) => {
      this.programmes = programmes;
      this.filteredProgrammes = programmes.filter((programme) => programme.machine.kind === this.machineKind.value);
    });
    this.machineKind.valueChanges.subscribe((value) => {
      this.filteredProgrammes = this.programmes.filter((programme) => programme.machine.kind === value);
      this.lookupForm.get('programme').setValue(null);
      this.lookupForm.get('programme').markAsUntouched();
    });
    const { machineKind, since } = this.route.snapshot.queryParams;
    if(machineKind) {
      this.machineKind.setValue(machineKind);
    }
    if(since) {
      this.since.setValue(new Date(since));
    }
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

  calculateTimeSteps(value: Date) {
    const strippedDate = stripTime(value);
    const startDate = strippedDate >= this.minDate ? strippedDate : this.minDate;
    const defautEndDate = stripTime(startDate);
    defautEndDate.setDate(defautEndDate.getDate() + 1);
    const endDate = defautEndDate >= this.maxDate ? this.maxDate : defautEndDate;
    const timeSteps = [];
    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      timeSteps.push(currentDate);
      currentDate = new Date(currentDate);
      currentDate.setMinutes(currentDate.getMinutes() + 10);
    }
    this.timeSteps = timeSteps;
  }

  dateEquals(date1: Date, date2: Date) {
    return date1.getTime() === date2.getTime();
  }

}

interface NarrowedAvailableSlots extends AvailableSlots {
  allSlots: string[];
}
