import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { liveSearch } from 'src/app/util/functions/liveSearch';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  stopNameState: boolean;
  stopCodeState: boolean;

  private liveSearchBusStopSubject = new Subject<string>();
  stopNameSearch$ = this.liveSearchBusStopSubject.pipe(
    liveSearch((stopName) => {
      if (stopName.length <= 0) {
        // Send empty array when empty string
        return of([]);
      }
      return this.http.searchBusStopByNameObs(stopName);
    })
  );
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      stopName: ['', Validators.required],
      stopCode: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      location: [''],
    });

    this.singleInputCheck();

    // this.searchForm.valueChanges.subscribe((res) => {
    //   console.log(this.searchForm.get('stopCode').errors);
    //   console.log(this.searchForm.get('stopCode'));
    // });
  }

  liveSearchBusStop(stopName: string) {
    this.liveSearchBusStopSubject.next(stopName);
  }

  QuickSearch(busStop) {
    console.log(busStop);
    console.log(typeof 'BusStopCode');
    this.router.navigate(['/busstop', busStop['BusStopCode']]);
  }

  onSubmit() {
    let value = this.searchForm.value;
    if (value['stopCode']) {
      // Route to bus stop list page
      return this.router.navigate(['/busstop', value['stopCode']]);
    }
    if (value['stopName']) {
      // Direct to bus stop detail page
      return this.router.navigate(['/busstop'], {
        queryParams: { stopName: value['stopName'] },
      });
    }
  }

  onGetLocation() {
    this.getPosition().then((pos) => {
      this.searchForm.get('location').patchValue(pos);
      // Route to bus stop list page
      this.router.navigate(['/busstop'], {
        queryParams: { lat: pos['lat'], lng: pos['lng'] },
      });
    });
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // Listener to allow either stopName or StopCode only
  singleInputCheck() {
    this.searchForm.valueChanges.subscribe(() => {
      let stopName = this.searchForm.get('stopName');
      let stopCode = this.searchForm.get('stopCode');

      if (stopCode.value) {
        stopName.disable({ onlySelf: true });
      } else {
        stopName.enable({ onlySelf: true });
      }

      if (stopName.value) {
        stopCode.disable({ onlySelf: true });
      } else {
        stopCode.enable({ onlySelf: true });
      }
    });
  }
}
