import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListProductsComponent } from './list-products/list-products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AuthGuard } from './auth/auth/auth.guard';

const routes: Routes = [
  { path: 'add-product', component: AddProductComponent , canActivate: [AuthGuard] },
  { path: 'edit-product', component: EditProductComponent , canActivate: [AuthGuard]},
  { path: '', component: ListProductsComponent, pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth/auth.module#AuthModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
