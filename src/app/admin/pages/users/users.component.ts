import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/lib/types/User';
import { UsersService } from 'src/app/services/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, map, merge, startWith, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent, UserDialogData } from '../../dialogs/user-dialog/user-dialog.component';
import { SuspendUserDialogComponent } from '../../dialogs/suspend-user-dialog/suspend-user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  constructor(private usersService: UsersService, private dialog: MatDialog) { }

  displayedColumns: string[] = ['status', 'firstName', 'lastName', 'room', 'email', 'phone', 'actions'];
  data: User[] = [];
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  performedActions: BehaviorSubject<string> = new BehaviorSubject('');

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.performedActions).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.usersService.findAll({ offset: this.paginator.pageIndex * this.paginator.pageSize, limit: this.paginator.pageSize });
      }),
      map(result => {
        this.isLoadingResults = false;
        this.resultsLength = result.count;
        return result.data;
      })
    ).subscribe(users => {
      const now = new Date();
      this.data = users.map(user => {
        const suspendedUntil = new Date(user.suspendedUntil);
        user.suspendedUntil = suspendedUntil > now ? suspendedUntil.toLocaleDateString("ro-RO") : null;
        return user;
      });
    });
  }

  addUser() {
    const dialogRef = this.dialog.open<UserDialogComponent, UserDialogData>(UserDialogComponent, {
      data: {
        mode: "create",
      }
    });
    dialogRef.afterClosed().subscribe((user) => {
      if(!user) return;
      this.refreshResults();
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open<UserDialogComponent, UserDialogData>(UserDialogComponent, {
      data: {
        mode: "edit",
        data: user
      }
    });
    dialogRef.afterClosed().subscribe((user) => {
      if(!user) return;
      this.refreshResults();
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open<UserDialogComponent, UserDialogData>(UserDialogComponent, {
      data: {
        mode: "delete",
        data: user
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(!result) return;
      this.refreshResults();
    });
  }

  suspendUser(user: User) {
    const dialogRef = this.dialog.open<SuspendUserDialogComponent, User>(SuspendUserDialogComponent, {
      data: user
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(!result) return;
      this.refreshResults();
    });
  }

  unsuspendUser(user: User) {
    this.usersService.unsuspend(user.id).subscribe((result) => {
      if(!result) return;
      this.refreshResults();
    });
  }

  resendActivationCode(user: User) {

  }

  refreshResults() {
    this.performedActions.next("refresh");
  }

}
