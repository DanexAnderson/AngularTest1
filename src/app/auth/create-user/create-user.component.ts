// Creator:  Dane Anderson
// Location: Kingston, Jamaica

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthData } from '../auth/auth.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  isloading = false;
  valid = 0;
  private authStatusSubs: Subscription;
  userData: AuthData;
  private mode = 'create';
  private userId = '';
  form: FormGroup;

  firstname = '';
  lastname = '';
  password = '';
  email = '';
  userRole = false;


  constructor(public authService: AuthService, public route: ActivatedRoute) { }

  onPost() {  // Populate form with Input Data
    this.valid = 1;
    if (this.form.invalid ) { return; }
    this.isloading = true;
    this.firstname = this.form.value.firstname;
    this.lastname = this.form.value.lastname;
    this.password = this.form.value.password;
    this.email = this.form.value.email;
    this.userRole = this.form.value.userRole;
    const usersData: AuthData = { firstName: this.firstname, lastName: this.lastname,
    password: this.password, email: this.email, isadmin: this.userRole }  ;

    if (this.mode === 'create') {
      this.authService.createUser(usersData);

    } else {

      this.authService.updateUser(this.userId, usersData);
    }

    this.form.reset(); // Remove post data from form fields

  }

  ngOnInit() {

    // Check if User is Authenticated
    this.authStatusSubs = this.authService.getAuthStatus().subscribe(
      authStatus => {
        this.isloading = false;
      });

    this.form = new FormGroup({
      'firstname': new FormControl
      (null, {validators: [Validators.required, Validators.minLength(2)]}),

      'lastname': new FormControl
      (null, {validators: [Validators.required, Validators.minLength(2)]}),

      'email': new FormControl
      (null, {validators: [Validators.required, Validators.minLength(2)]}),

      'password': new FormControl
      (null, {validators: [Validators.required, Validators.minLength(2)]}),

      'userRole': new FormControl
      (null, {validators: [Validators.required, Validators.minLength(2)]})
    });
    this.authStatusSubs = this.authService.getAuthStatus().subscribe(
      authStatus => {
        this.isloading = false;
      }
    );

    this.route.paramMap.subscribe((paramMap: ParamMap) => { // event ParamMap

      if (paramMap.has('userId')) { // Check if URL parameter exist with Id

        this.mode = 'edit';
        this.userId = paramMap.get('userId'); // Get URL parameter
        this.isloading = true;
        this.authService.getuserData(this.userId).subscribe(userData => {
          this.isloading = false;

          this.userId = userData._id;

          this.userData = {
             firstName: userData.firstname,
             lastName: userData.lastname,
              email: userData.email,
              isadmin: userData.isadmin,
              password: userData.password
             };
                // Populate Form with data retrieved from database
          this.form.setValue({
            'firstname': this.userData.firstName,
            'lastname': this.userData.lastName,
            'email': this.userData.email,
            'password': this.userData.password,
            'userRole': this.userData.isadmin ? true : 'false' ,
          });
        });
      } else { this.mode = 'create'; this.userId = null; }
    });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
