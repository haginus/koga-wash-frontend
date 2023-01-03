import { Component, OnInit } from '@angular/core';
import { AvailableInstancesDto } from 'src/app/lib/types/dto/available-instances.dto';
import { ReservationsService } from 'src/app/services/reservations.service';

@Component({
  selector: 'app-available-instances',
  templateUrl: './available-instances.component.html',
  styleUrls: ['./available-instances.component.scss']
})
export class AvailableInstancesComponent implements OnInit {

  constructor(private reservationsService: ReservationsService) { }

  isLoading: boolean = true;
  lastUpdated: Date = new Date();
  instances: AvailableInstancesDto[] = [];

  ngOnInit(): void {
    this.getAvailableInstances();
  }

  getAvailableInstances() {
    this.isLoading = true;
    this.reservationsService.findAvailableInstances().subscribe(instances => {
      this.instances = instances;
      this.lastUpdated = new Date();
      this.isLoading = false;
    });
  }

}
