import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from 'src/app/service/auth.service';
import { RoutingService } from 'src/app/service/routing.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private token: string;
  loginForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private RoutingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.password = this.loginForm.get('password');
    this.username = this.loginForm.get('username');
  }
  patch() {
    this.loginForm.patchValue({
      username: 'abcd',
      password: 'abcd',
    });
  }

  async onLogin() {
    try {
      let result = await this.auth.loginUser(this.loginForm.value);
      if (result['status'] === 200) {
        this.auth.setTokenToLS({ token: result['body']['token'] });
      }
      this.RoutingService.profile();
    } catch (error) {
      console.log(error);
      switch (error['status']) {
        case 403:
          alert('Account not yet activated, please activate before login');
          break;
        default:
          alert('Something went wrong');
      }
    }
  }
}
