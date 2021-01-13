import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-busstoplist',
  templateUrl: './busstoplist.component.html',
  styleUrls: ['./busstoplist.component.css'],
})
export class BusstoplistComponent implements OnInit {
  searchResult: [];
  stopCode: string;
  stopName: string;
  lat: number;
  lng: number;
  constructor(private route: ActivatedRoute, private http: HttpService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.stopCode = params['stopCode'];
      this.stopName = params['stopName'];
      this.lat = parseFloat(params['lat']);
      this.lng = parseFloat(params['lng']);
    });

    this.search();
  }

  async search() {
    try {
      if (this.stopName) {
        this.searchResult = await this.http.searchBusStopByName(this.stopName);
      } else if (this.lat && this.lng) {
        this.searchResult = await this.http.searchBusStopByLocation(
          this.lat,
          this.lng
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
