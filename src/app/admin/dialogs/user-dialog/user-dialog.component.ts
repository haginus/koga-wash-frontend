import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/lib/types/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private snackbar: MatSnackBar,
  ) { }

  userForm = new FormGroup({
    firstName: new FormControl(this.data.data?.firstName, [Validators.required]),
    lastName: new FormControl(this.data.data?.lastName, [Validators.required]),
    email: new FormControl(this.data.data?.email, [Validators.required, Validators.email]),
    phone: new FormControl(this.data.data?.phone, [Validators.required]),
    room: new FormControl(this.data.data?.room, [Validators.required]),
  });

  isLoading = false;

  ngOnInit(): void {
    if(this.data.mode == 'edit') {
      this.userForm.get('email').disable();
    }
  }

  addUser() {
    this.isLoading = true;
    this.usersService.create({ ...this.userForm.value, role: 'user' }).subscribe((user) => {
      if(!user) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Utilizatorul a fost creat.");
      this.dialogRef.close(user);
    });
  }

  editUser() {
    this.isLoading = true;
    this.usersService.update({ ...this.data.data, ...this.userForm.value, }).subscribe((user) => {
      if(!user) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Utilizatorul a fost modificat.");
      this.dialogRef.close(user);
    });
  }

  deleteUser() {
    this.isLoading = true;
    this.usersService.delete(this.data.data.id).subscribe((result) => {
      if(!result) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Utilizatorul a fost șters.");
      this.dialogRef.close(true);
    });
  }

}

export interface UserDialogData {
  mode: "view" | "create" | "edit" | "delete";
  data?: User;
}
