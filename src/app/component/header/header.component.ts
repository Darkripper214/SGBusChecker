import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  // Authentication state for display of navbar
  isAuthenticated: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated();
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user['token'];
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  onLogout() {
    this.authService.logoutUser();
  }
}
