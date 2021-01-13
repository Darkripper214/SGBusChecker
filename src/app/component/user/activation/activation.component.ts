import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { RoutingService } from 'src/app/service/routing.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
})
export class ActivationComponent implements OnInit {
  link: string;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private RoutingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.link = this.route.snapshot.params['link'];
    this.activateAccount(this.link);
  }

  async activateAccount(link: string) {
    try {
      let result = await this.authService.activateUser(link);
      alert(result['success']);
      this.RoutingService.login();
    } catch (error) {
      alert(error['error']['error']);
    }
  }
}
