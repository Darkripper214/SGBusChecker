import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private updateProfile$ = new Subject<{}>();
  updateProfile = this.updateProfile$ as Observable<{}>;
  constructor(private http: HttpClient) {}

  searchBusStopByLocation(lat: number, lng: number) {
    const params = new HttpParams()
      .set('longitude', lng.toString())
      .set('latitude', lat.toString());
    return this.http
      .get<[]>(`/api/busstop/location/`, { params })
      .toPromise();
  }
  searchBusStopByName(name: string) {
    return this.http.get<[]>(`/api/busstop/desc/${name}`).toPromise();
  }

  searchBusStopByNameObs(name: string) {
    return this.http
      .get<[]>(`/api/busstop/desc/${name}`)
      .pipe(catchError((err) => of([])));
  }
  searchBusStopByCode(code: string) {
    return this.http.get<{}>(`/api/busstop/code/${code}`).toPromise();
  }

  getBusArrivalByCode(code: string) {
    return this.http.get<{}>(`/api/busarrival/code/${code}`).toPromise();
  }

  getUserProfile(token: string) {
    return this.http
      .get<{}>(`/api/user/profile`, {
        headers: { token: token },
        observe: 'response',
      })
      .toPromise();
  }

  updateUserProfile(formData: FormData, token: string) {
    return this.http
      .post<{}>(`/api/user/profile`, formData, {
        headers: { token: token },
        observe: 'response',
      })
      .toPromise();
  }
}
