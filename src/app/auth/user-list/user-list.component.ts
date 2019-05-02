import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ConfirmationComponent } from './confirmation.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
    public snackBar: MatSnackBar, private authService: AuthService) { }

 // @Input()
  users: any = [];
  private usersSub: Subscription;
  isloading = false;

  private authStatusSub: Subscription;
  userIsAuth = false;
  userId: string;


  ngOnInit() {
    this.isloading = true;

    this.users = this.authService.getUsers();

    this.userId = this.authService.getUserId();
    this.usersSub = this.authService.getUsersUpdated()
    .subscribe((usersData) => {
    this.isloading = false;
      this.users = usersData.users;

      console.dir(this.users);
    });
        this.userIsAuth = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatus()
    .subscribe(isAuthenticated => {
      this.userIsAuth = isAuthenticated;
      this.userId = this.authService.getUserId();
      }
    );
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
      this.snackBar.open('Post Deleted Successfully !!', 'OK', {
        duration: 3000,
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
