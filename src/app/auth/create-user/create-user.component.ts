import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { AuthData } from '../auth/auth.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  isloading = false;
  valid = 0;
  private authStatusSubs: Subscription;
  maxDate: any;
  userData: AuthData;

  constructor(public authService: AuthService) { }

  onSignup(form: NgForm) {
    this.valid = 1;

    if (form.invalid) {
      return;
    }
    this.isloading = true;
    this.userData = { email: form.value.email, password: form.value.password,
       firstName: form.value.firstname, lastName: form.value.lastname, isadmin: form.value.userRole };

    this.authService.createUser(this.userData);
  }
  u(u: any) {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
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
