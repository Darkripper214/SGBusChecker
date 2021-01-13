import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  stopNameState: boolean;
  stopCodeState: boolean;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      stopName: [''],
      stopCode: [''],
      location: [''],
    });

    this.singleInputCheck();
  }

  onSubmit() {
    let value = this.searchForm.value;
    if (value['stopName']) {
      // Direct to bus stop detail page
      this.router.navigate(['/busstop'], {
        queryParams: { stopName: value['stopName'] },
      });
    } else if (value['stopCode']) {
      // Route to bus stop list page
      this.router.navigate(['/busstop', value['stopCode']]);
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
