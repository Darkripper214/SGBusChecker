import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { RoutingService } from 'src/app/service/routing.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  password2: AbstractControl;
  email: AbstractControl;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private RoutingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        password2: ['', [Validators.required, Validators.minLength(4)]],
        email: [
          '',
          [
            Validators.required,
            // Added email pattern matching for more rigorous email, double verified at server side as well
            Validators.email,
            Validators.pattern(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ],
        ],
      },
      // Check if password and password2 is the same at formGroup level
      { validator: this.checkPasswords }
    );

    this.initiateControl();
  }
  // For easy reference of form control
  initiateControl() {
    this.username = this.registerForm.get('username');
    this.password = this.registerForm.get('password');
    this.password2 = this.registerForm.get('password2');
    this.email = this.registerForm.get('email');
  }

  // Custom Validators to check if password and password 2 field is equal
  checkPasswords(group: FormGroup): { [key: string]: boolean } | null {
    let pass = group.get('password').value;
    let pass2 = group.get('password2').value;
    return pass === pass2 ? null : { notSame: true };
  }

  patch() {
    this.registerForm.patchValue({
      username: 'abcd',
      password: 'abcd',
      password2: 'abcd',
      email: 'phakorn214@gmail.com',
    });
  }

  async onSubmit() {
    try {
      let result = await this.auth.registerUser(this.registerForm.value);
      if (result['status'] === 200) {
        alert('Account registered, please activate email to use account');
        this.RoutingService.login();
      }
    } catch (error) {
      console.log(error);
      switch (error['status']) {
        case 400:
          if (error['error']['code'] == 'ER_DUP_ENTRY') {
            alert('Account exists, please change your username or email');
          } else {
            alert(error['code']);
          }
          break;
        case 401:
          alert('Please provide valid email address');
          break;
        default:
          alert('Something went wrong');
      }
    }
  }
}
