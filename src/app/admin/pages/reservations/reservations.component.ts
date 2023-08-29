import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, map, merge, startWith, switchMap } from 'rxjs';
import { RESERVATION_STATUS } from 'src/app/lib/constants';
import { Reservation } from 'src/app/lib/types/Reservation';
import { User } from 'src/app/lib/types/User';
import { UserQueryDto } from 'src/app/lib/types/dto/user-query.dto';
import { removeEmptyAttributes } from 'src/app/lib/utils';
import { MachineInstancesService } from 'src/app/services/machine-instances.service';
import { ProgrammesService } from 'src/app/services/programmes.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements AfterViewInit {

  constructor(
    private reservationsService: ReservationsService,
    private usersService: UsersService,
    private machineInstancesService: MachineInstancesService,
    private programmesService: ProgrammesService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  displayedColumns: string[] = ['machineInstance.name', 'programme.name', 'user.lastName', 'startTime', 'status', 'actions'];
  data: ReservationTableEntry[] = [];
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  performedActions: BehaviorSubject<string> = new BehaviorSubject('');

  filterForm = new FormGroup({
    'status': new FormControl(undefined),
    'instanceId': new FormControl(undefined),
    'userId': new FormControl(undefined),
  });

  userForm = new FormGroup({
    'lastName': new FormControl(''),
    'firstName': new FormControl(''),
  });

  searchedUsers: User[] = [];
  $machineInstances = this.machineInstancesService.findAll();
  $programmes = this.programmesService.findAll();
  showFilters = false;

  resetFilterForm() {
    this.filterForm.reset();
  }

  toggleFilters() {
    if(this.showFilters && this.filterForm.dirty) {
      this.resetFilterForm();
    }
    this.showFilters = !this.showFilters;
  }

  RESERVATION_STATUS = RESERVATION_STATUS;

  ngAfterViewInit(): void {
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges, this.performedActions).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.reservationsService.findAll({ 
          offset: this.paginator.pageIndex * this.paginator.pageSize, 
          limit: this.paginator.pageSize,
          sortBy: this.sort.active as any,
          sortDirection: this.sort.direction.toLocaleUpperCase() as any,
          ...removeEmptyAttributes(this.filterForm.value),
        });
      }),
      map(result => {
        this.isLoadingResults = false;
        this.resultsLength = result.count;
        return result.data;
      })
    ).subscribe(reservations => {
      this.data = reservations.map(reservation => ({ ...reservation, isLoading: false }));
    });
    this.userForm.valueChanges.pipe(debounceTime(300)).subscribe(this.searchUsers.bind(this));
  }

  refreshResults() {
    this.performedActions.next("refresh");
  }

  addReservation() {
    this.router.navigate(['admin', 'slots-lookup']);
  }

  viewReservation(reservation: ReservationTableEntry) {
    this.router.navigate(['admin', 'reservations', reservation.id]);
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

  searchUsers(query?: UserQueryDto) {
    this.usersService.findAll(removeEmptyAttributes(query)).subscribe(users => {
      this.searchedUsers = users.data;
    });
  }

}

type ReservationTableEntry = Reservation & { isLoading?: boolean };
