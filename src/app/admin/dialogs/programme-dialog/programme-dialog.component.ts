import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PROGRAMME_MATERIAL_KINDS } from 'src/app/lib/constants';
import { Programme } from 'src/app/lib/types/Programme';
import { ProgrammesService } from 'src/app/services/programmes.service';

@Component({
  selector: 'app-programme-dialog',
  templateUrl: './programme-dialog.component.html',
  styleUrls: ['./programme-dialog.component.scss']
})
export class ProgrammeDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProgrammeDialogData,
    private programmesService: ProgrammesService,
    private dialogRef: MatDialogRef<ProgrammeDialogComponent>,
    private snackbar: MatSnackBar,
  ) { }

  programmeForm = new FormGroup({
    name: new FormControl(this.data.programme?.name, [Validators.required]),
    wheelIndex: new FormControl(this.data.programme?.wheelIndex || 0),
    description: new FormControl(this.data.programme?.description),
    duration: new FormControl(this.data.programme?.duration, [Validators.required, Validators.min(1)]),
    materialKind: new FormControl(this.data.programme?.materialKind, [Validators.required]),
    machineId: new FormControl(this.data.machineId),
  });

  isLoading = false;

  PROGRAMME_MATERIAL_KINDS = PROGRAMME_MATERIAL_KINDS;

  get durationChanged() {
    return this.data.programme && this.programmeForm.get('duration').value !== this.data.programme?.duration;
  }

  ngOnInit(): void {
  }

  addProgramme() {
    this.isLoading = true;
    this.programmesService.create({ ...this.programmeForm.value }).subscribe((programme) => {
      if(!programme) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Programul a fost creat.");
      this.dialogRef.close(programme);
    });
  }

  editProgramme() {
    this.isLoading = true;
    this.programmesService.update({ ...this.data.programme, ...this.programmeForm.value, }).subscribe((programme) => {
      if(!programme) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Programul a fost modificat.");
      this.dialogRef.close(programme);
    });
  }

  deleteProgramme() {
    if(!confirm("Sunteți sigur că vreți să ștergi acest program? Toate rezervările pentru acesta vor fi șterse.")) return;
    this.isLoading = true;
    this.programmesService.delete(this.data.programme.id).subscribe((result) => {
      if(!result) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Programul a fost șters.");
      this.dialogRef.close(null);
    });
  }

}

export interface ProgrammeDialogData {
  mode: 'create' | 'edit';
  programme?: Programme;
  machineId: string;
}
