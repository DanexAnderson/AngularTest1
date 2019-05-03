// Creator:  Dane Anderson
// Location: Kingston, Jamaica

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { AuthData } from '../auth/auth.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  isloading = false;
  userData: AuthData;

  isloading$: Observable<boolean>;
  valid = 0; // mat error form true or false
  private authStatusSubs: Subscription;
  constructor(public authService: AuthService) { }

  onLogin(form: NgForm) {
    this.valid = 1;
    if (form.invalid) {
      return;
    }

    this.isloading = true;
    this.userData = {email: form.value.email, password: form.value.password, firstName: '',
                      lastName: '', isadmin: false };

    this.authService.loginUser(this.userData);
  }

  ngOnInit() {

    this.authStatusSubs = this.authService.getAuthStatus().subscribe(
      authStatus => {
       this.isloading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }


}
// Creator:  Dane Anderson
// Location: Kingston, Jamaica
