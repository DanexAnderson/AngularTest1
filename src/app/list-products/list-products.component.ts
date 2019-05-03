import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ProductModel } from '../ProductModel';
import { ProductService } from '../product.service';
import { AuthService } from '../auth/auth/auth.service';
import { ErrorComponent } from '../error/error.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationComponent } from '../auth/user-list/confirmation.component';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

  products: ProductModel[];
  isadmin = false;

  constructor(private productService: ProductService, private dialog: MatDialog,
    public snackBar: MatSnackBar,
     private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.getAllProducts();
    this.isadmin = this.authService.getIsAdmin();
  }

    // Error Message for modifying users without admin rights
    getMessage() {
      if (!this.isadmin) {

        const dialogRef = this.dialog.open(ErrorComponent,
          {data: {message: 'You do not have Administrator Rights'}});
      }
    }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe(data=>{
      this.products = data;
    });
  };

  addProduct(): void {
    if (this.isadmin) { // User will be route to Add-product if Admin Role
    this.router.navigate(['add-product']);
  }
  }

  deleteProduct(product: ProductModel) {

    const dialogRef = this.dialog.open(ConfirmationComponent,
      {data: {deletePost: 'This post will be Deleted'}});

  dialogRef.afterClosed().subscribe(result => {

    if (result) {

this.productService.deleteProduct(product._id).subscribe(data=>{
      console.log(data);
      this.getAllProducts();
      this.snackBar.open('Product Deleted Successfully !!', 'OK', {
        duration: 6000,
      });
    });

    } else {
       return;
       }
  });

  }

  updateProduct(product: ProductModel){
    localStorage.removeItem("productId");
    localStorage.setItem("productId", product._id);
    this.router.navigate(['edit-product']);
  }

}
