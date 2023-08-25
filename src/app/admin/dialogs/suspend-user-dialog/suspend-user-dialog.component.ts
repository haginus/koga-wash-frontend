import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/lib/types/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-suspend-user-dialog',
  templateUrl: './suspend-user-dialog.component.html',
  styleUrls: ['./suspend-user-dialog.component.scss']
})
export class SuspendUserDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<SuspendUserDialogComponent>,
    private snackbar: MatSnackBar,
  ) { }

  suspendForm = new FormGroup({
    until: new FormControl(null, [Validators.required]),
  });

  minDate = new Date().toISOString().split('T')[0];

  isLoading = false;

  suspendUser() {
    this.usersService.suspend(this.user.id, this.suspendForm.value.until).subscribe(res => {
      if(res) {
        this.snackbar.open('Utilizatorul a fost suspendat.');
        this.dialogRef.close(true);
      }
    }
    );
  }

}
