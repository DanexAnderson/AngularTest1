// Creator:  Dane Anderson
// Location: Kingston, Jamaica

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth.model';

const BASE_URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData: AuthData;
  private isAuth = false;
  private tokenTimer: any;
  private userId: string;
  private token: string;
  users: any = [];

  private isadmin = false;
  private authStatusLister = new Subject<boolean>();
  private namesListner = new Subject<string>();
  private usersUpdated = new Subject<{users: any[]}>();
  fname = '';


  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  // User Role identifier
  getIsAdmin() {
    return this.isadmin;
  }

  // get first Name of Login User
  getNames() {
    return this.fname;
  }

  // Subscription to User's first name
   getNamesSubs() {
    return this.namesListner.asObservable();
  }

   // check if User is Authenticated
  getIsAuth() {
    return this.isAuth;
  }

  getAuthStatus() {
    return this.authStatusLister.asObservable();
  }

  createUser(user: AuthData) {       // SignUp Component

    return this.http.post(BASE_URL + 'createuser', user)
    .subscribe(() => {

    // this.loginUser(user);
      this.router.navigate(['/auth/userlist']);
    }, error => {
      console.log(error);
      this.authStatusLister.next(false);
    }

    );
  }


  logOut() {
    this.token = null;
    this.isAuth = false;
    this.isadmin = false;
    this.namesListner.next('');
    this.authStatusLister.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/auth/signin']);

  }

  loginUser(user: AuthData) {

    this.http.post<{token: string, expiresIn: number, userId: string, firstName: string, isadmin: boolean }>
    (BASE_URL + 'signin', user)
    .subscribe(response => {
       const token = response.token;
       this.token = token;

       this.fname = response.firstName;
       this.isadmin = response.isadmin;

      if (response.token) {
        this.namesListner.next(this.fname);
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuth = true;
        this.userId = response.userId;

        this.authStatusLister.next(true);
        const now = new Date();
        const expirationDate = new Date (now .getTime() + expiresInDuration * 1000);
        this.saveAuthData(response.token, expirationDate, this.userId, this.fname, this.isadmin ? 'true' : 'false');

         this.router.navigate(['/']);


      }

    }, error => {

      this.authStatusLister.next(false);
    });
  }

  getUserId() {
    return this.userId;
  }

  // Update A User on Selection of that user
  getuserData(id: string) {
   return this.http.get<any>(BASE_URL + 'getuserone/' + id);
  }

  getUsers() {

    this.http.get<{message: string, users: any}>
    ( BASE_URL + 'getusers')
    .pipe(map((userData) => {
      return { users: userData.users.map(user => {
        return {
          firstName: user.firstname,
          lastName: user.lastname,
          userId: user._id,
          email: user.email,
          isadmin: user.isadmin
        };
      })};
    } ))
    .subscribe((transformUserData) => {
      // console.log(transformPostData);
      this.users = transformUserData.users; // Add new post to the Post Array
      this.usersUpdated.next({users: [...this.users]}); // update the list of post array event

    });

  }

  getUsersUpdated() {
    return this.usersUpdated.asObservable(); // return private variable users event array
  }

  deleteUser(userId: string) {
    if (this.isadmin) {         // Delete Only If the User has a role of Administrator

    // const user = { user: this.userId };
    return this.http.delete(BASE_URL + 'deleteuser/' + userId);
    } else {  this.router.navigate(['/auth/userlist']); }
  }

  autoAuthUser() {

    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuth = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusLister.next(true);
      this.fname = authInfo.fname;
      this.isadmin = authInfo.isadmin === 'true' ? true : false; // string to boolean
      this.namesListner.next(this.fname);

    }
  }

  updateUser(id: string, data: AuthData) {
    let postData: any ;

      postData = { _id: id, firstname: data.firstName, lastname: data.lastName,
         email: data.email, password: data.password, isadmin: data.isadmin, userId: this.userId };

       this.http.put<{message: string, result: any}>(BASE_URL + 'updateuser/' + id, postData)
    .subscribe((response) => {

     this.router.navigate(['/auth/userlist']);
  });
  }

  // User Session Timer
  private setAuthTimer(duration: number) {
   // console.log('Seting timer: ' + duration );
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

// Store Data from Browser LocalStorage
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const fname = localStorage.getItem('fname');
    const isadmin = localStorage.getItem('isadmin');
    if ( !token || !expirationDate) {

      return;
    }

    return { token: token, expirationDate: new Date(expirationDate), userId: userId, fname: fname, isadmin: isadmin };
  }

 // Save User Session in browser LocalStorage
  private saveAuthData(token: string, expirationDate: Date, userId: string, fname: string, isadmin: string) {

    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('fname', fname);
    localStorage.setItem('isadmin', isadmin);
  }

  private clearAuthData() {

    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('fname');
    localStorage.removeItem('isadmin');
  }
}
