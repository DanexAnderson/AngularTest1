import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  isloading = false;
  valid = 0;
  private authStatusSubs: Subscription;
  maxDate: any;

  constructor(public authService: AuthService) { }

  onSignup(form: NgForm) {
    this.valid = 1;
    if (form.invalid) {
      return;
    }
    this.isloading = true;
    this.authService.createUser(form.value.email, form.value.password,
       form.value.firstname, form.value.lastname, form.value.birthday );
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
