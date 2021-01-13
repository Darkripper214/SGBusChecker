import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { RoutingService } from './routing.service';

const jwtHelper = new JwtHelperService();

interface User {
  username: string;
  password: string;
}

interface UserRegister extends User {
  email: string;
}

export interface LSToken {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<LSToken>({ token: '' });

  constructor(
    private http: HttpClient,
    private routingService: RoutingService
  ) {}

  registerUser(user: UserRegister) {
    return this.http
      .post('/api/user', user, { observe: 'response' })
      .toPromise();
  }

  loginUser(user: User) {
    return this.http
      .post('/api/user/login', user, { observe: 'response' })
      .toPromise();
  }

  activateUser(link: string) {
    return this.http.get(`/api/user/activation/${link}`).toPromise();
  }

  logoutUser() {
    this.clearTokenFromLS();
    this.user.next({ token: '' });
    this.routingService.search();
  }

  isAuthenticated() {
    const token = this.getTokenFromLS();
    // if no token
    if (!token) {
      return false;
    }
    // Return if token exists, leave the verification of token to serverside
    // If token expired, clear from LS
    if (jwtHelper.isTokenExpired(token['token'])) {
      this.clearTokenFromLS();
      return false;
    } else {
      this.user.next(token);
      return true;
    }
  }

  clearTokenFromLS() {
    localStorage.removeItem('busCheckerToken');
  }

  getTokenFromLS(): LSToken {
    return JSON.parse(localStorage.getItem('busCheckerToken')) as LSToken;
  }

  setTokenToLS(token: LSToken) {
    localStorage.setItem('busCheckerToken', JSON.stringify(token));
  }
}
