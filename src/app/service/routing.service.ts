import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(private router: Router) {}
  profile() {
    this.router.navigate(['/profile']);
  }

  search() {
    this.router.navigate(['/']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  busstop() {
    this.router.navigate(['/busstop']);
  }

  busstopDetail(id) {
    this.router.navigate(['/busstop', id]);
  }
}
