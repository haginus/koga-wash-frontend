import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MachineInstance } from 'src/app/lib/types/MachineInstance';
import { Plug } from 'src/app/lib/types/Plug';
import { MachineInstancesService } from 'src/app/services/machine-instances.service';
import { PlugsService } from 'src/app/services/plugs.service';

@Component({
  selector: 'app-instance-dialog',
  templateUrl: './instance-dialog.component.html',
  styleUrls: ['./instance-dialog.component.scss']
})
export class InstanceDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InstanceDialogData,
    private machineInstancesService: MachineInstancesService,
    private plugsService: PlugsService,
    private dialogRef: MatDialogRef<InstanceDialogComponent>,
    private snackbar: MatSnackBar,
  ) { }

  isLoading = false;
  isLoadingPlugs = true;
  plugs: Plug[] = [];

  instanceForm = new FormGroup({
    machineId: new FormControl(this.data.machineId, [Validators.required]),
    name: new FormControl(this.data.instance?.name, [Validators.required]),
    isFaulty: new FormControl(this.data.instance?.isFaulty || false, [Validators.required]),
    plugId: new FormControl(this.data.instance?.plugId ? [this.data.instance?.plugId]: [], [Validators.required]),
  });

  ngOnInit(): void {
    this.loadPlugs();
  }

  loadPlugs() {
    this.isLoadingPlugs = true;
    this.plugsService.findAll().subscribe(plugs => {
      this.plugs = plugs;
      this.isLoadingPlugs = false;
      if(!plugs.find(plug => plug.deviceId === this.data.instance?.plugId)) {
        this.instanceForm.get('plugId')?.setValue([]);
      }
    });
  }

  formatMacAddress(mac: string) {
    return mac.split('').reduce((acc, char, i) => {
      if(i % 2 === 0) {
        acc += ':';
      }
      return acc + char;
    });
  }

  getFormValue() {
    const formValue = this.instanceForm.value;
    return { ...formValue, plugId: formValue.plugId[0] };
  }

  addInstance() {
    this.isLoading = true;
    this.machineInstancesService.create({ ...this.getFormValue() }).subscribe((instance) => {
      if(!instance) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Instanța a fost creată.");
      this.dialogRef.close(instance);
    });
  }

  editInstance() {
    this.isLoading = true;
    this.machineInstancesService.update({ ...this.getFormValue(), id: this.data.instance.id }).subscribe((instance) => {
      if(!instance) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Instanța a fost modificată.");
      this.dialogRef.close(instance);
    });
  }

  deleteInstance() {
    if(!confirm("Sunteți sigur că doriți să ștergeți această instanță?")) return;
    this.isLoading = true;
    this.machineInstancesService.delete(this.data.instance.id).subscribe((result) => {
      if(!result) {
        this.isLoading = false;
        return;
      }
      this.snackbar.open("Instanța a fost ștearsă.");
      this.dialogRef.close(null);
    });
  }

}

export interface InstanceDialogData {
  mode: 'create' | 'edit';
  instance?: MachineInstance;
  machineId: string;
}
