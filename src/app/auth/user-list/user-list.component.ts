import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ConfirmationComponent } from './confirmation.component';
import { ErrorComponent } from 'src/app/error/error.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  dataSource = [];

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'userRole', 'userId'];

  constructor(private dialog: MatDialog,
    public snackBar: MatSnackBar, private authService: AuthService) { }

 // @Input()
  users: any = [];
  private usersSub: Subscription;
  isloading = false;
  isadmin = false;
  private authStatusSub: Subscription;
  userIsAuth = false;
  userId: string;


  ngOnInit() {
    this.isloading = true;
    this.isadmin = this.authService.getIsAdmin();
    this.users = this.authService.getUsers();

    this.userId = this.authService.getUserId();
    this.usersSub = this.authService.getUsersUpdated()
    .subscribe((usersData) => {
    this.isloading = false;
      this.users = usersData.users;
      this.dataSource = this.users;

    });
        this.userIsAuth = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatus()
    .subscribe(isAuthenticated => {
      this.userIsAuth = isAuthenticated;
      this.userId = this.authService.getUserId();
      }
    );
  }

  // Error Message for modifying users without admin rights
  getMessage() {
    if (!this.isadmin) {

      const dialogRef = this.dialog.open(ErrorComponent,
        {data: {message: 'You do not have Administrator Rights'}});
    }
  }

  onDelete(userId: string) {

    const dialogRef = this.dialog.open(ConfirmationComponent,
      {data: {deletePost: 'This post will be Deleted'}});

  dialogRef.afterClosed().subscribe(result => {

    if (result) {
     // this.trainingExit.emit();
      this.isloading = true;

    this.authService.deleteUser(userId)
    .subscribe(() => {
      this.authService.getUsers();
      this.snackBar.open('User Deleted Successfully !!', 'OK', {
        duration: 6000,
      });

    }, () => {this.isloading = false; });

    } else {
       return;
       }
  });


  }

ngOnDestroy() {
  this.usersSub.unsubscribe();
  this.authStatusSub.unsubscribe();
}

}
