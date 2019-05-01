import { Component, Output, OnInit } from '@angular/core';
import { AuthService } from './auth/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  route: boolean;
  @Output() title = 'Product Webapp';

  constructor(private authService: AuthService, private router: Router) {
    router.events.subscribe((url: any) => this.route = router.url.includes('/') );
  }


  ngOnInit(): void {

    this.authService.autoAuthUser();
  }

}
