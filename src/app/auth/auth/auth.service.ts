import { Injectable } from '@angular/core';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData: AuthData;
  private isAuth = false;
  private tokenTimer: any;
  private userId: string;
  private jwt = '';

  private isadmin = false;
  private authStatusLister = new Subject<boolean>();
  private namesListner = new Subject<string>();
  fname = '';


  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.jwt;
  }

  getIsAdmin() {
    return this.isadmin;
  }

  getNames() {
    return this.fname;
  }

   getNamesSubs() {
    return this.namesListner.asObservable();
  }

  getIsAuth() {
    return this.isAuth;
  }

  getAuthStatus() {
    return this.authStatusLister.asObservable();
  }

  createUser(user: AuthData) {       // SignUp Component

    return this.http.post(BASE_URL + 'createuser', user)
    .subscribe(() => {

    this.loginUser(user);
      this.router.navigate(['/']);
    }, error => {
      console.log(error);
      this.authStatusLister.next(false);
    }

    );
  }


  logOut() {
    this.jwt = null;
    this.isAuth = false;
    this.namesListner.next('');
    this.authStatusLister.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  loginUser(user: AuthData) {

    this.http.post<{jwt: string, expiresIn: number, userId: string, firstName: string, isadmin: boolean }>
    (BASE_URL + 'signin', user)
    .subscribe(response => {
       this.jwt = response.jwt;

       this.fname = response.firstName;
       this.isadmin = response.isadmin;

      if (response.jwt) {
        this.namesListner.next(this.fname);
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuth = true;
        this.userId = response.userId;

        this.authStatusLister.next(true);
        const now = new Date();
        const expirationDate = new Date (now .getTime() + expiresInDuration * 1000);
        this.saveAuthData(response.jwt, expirationDate, this.userId, this.fname);

         this.router.navigate(['/']);


      }

    }, error => {

      this.authStatusLister.next(false);
    });
  }

  getUserId() {
    return this.userId;
  }

  autoAuthUser() {

    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.jwt = authInfo.token;
      this.isAuth = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusLister.next(true);
      this.fname = authInfo.fname;
      this.namesListner.next(this.fname);

    }
  }

  private setAuthTimer(duration: number) {
   // console.log('Seting timer: ' + duration );
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const fname = localStorage.getItem('fname');
    if ( !token || !expirationDate) {

      return;
    }

    return { token: token, expirationDate: new Date(expirationDate), userId: userId, fname: fname };
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, fname: string) {

    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('fname', fname);
  }

  private clearAuthData() {

    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('fname');
  }
}
