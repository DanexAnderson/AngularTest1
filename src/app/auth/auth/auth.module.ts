import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from '../signin/signin.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { AuthGuard } from './auth.guard';

// URL Routes: example: 'http://localhost/auth/signin .
// Would be relocated to separate file if there were many more routes
const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'createuser', component: CreateUserComponent },
  { path: 'edituser/:userID', component: CreateUserComponent }, // , canActivate: [AuthGuard]
  { path: 'signin', component: SigninComponent }
];

@NgModule({
  declarations: [SigninComponent, CreateUserComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AuthModule { }
