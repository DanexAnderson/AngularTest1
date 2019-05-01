import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() title = '';
  navbarOpen = false;
  private authListenerSubs: Subscription;
  private nameListnerSubs: Subscription;
  userIsAuth = false;
  route = '';
  firstname = '';


  constructor( private router: Router, private authService: AuthService) {

    router.events.subscribe((url: any) => this.route = router.url );
   }



   toggleNavbar() {
     this.navbarOpen = !this.navbarOpen;
   }

   onLogout() {
    this.authService.logOut();
   }
  ngOnInit() {

    this.userIsAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatus()
    .subscribe(isAuthenticated => {
      this.userIsAuth = isAuthenticated;
    });

        this.firstname = this.authService.getNames();
        this.nameListnerSubs = this.authService.getNamesSubs().subscribe(fname => {
        this.firstname = fname;

      });


  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.nameListnerSubs.unsubscribe();
  }

}
