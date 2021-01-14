import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

interface BusStop extends Object {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}
@Component({
  selector: 'app-busstop',
  templateUrl: './busstop.component.html',
  styleUrls: ['./busstop.component.css'],
})
export class BusstopComponent implements OnInit {
  busStopDetail: BusStop | {} = {};

  oneMapUrl: string;
  googleUrl: string;
  stopCode: string;

  constructor(private route: ActivatedRoute, private http: HttpService) {}

  ngOnInit(): void {
    this.stopCode = this.route.snapshot.params['id'];

    this.http
      .searchBusStopByCode(this.stopCode)
      .then((res) => {
        this.busStopDetail = res;
        this.googleUrl = `https://maps.google.com/maps?q=${res['Latitude']},${res['Longitude']}&z=16&output=embed`;
      })
      .catch((err) => console.log(err));
  }

  isEmptyObject(obj: any) {
    return obj && Object.keys(obj).length === 0;
  }
}
