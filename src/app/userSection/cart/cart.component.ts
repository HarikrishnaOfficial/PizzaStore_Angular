import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: any;
}

interface Cart {
  id: string;
  userId: number;
  items: CartItem[];
  total: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  private cartSubscription: Subscription | undefined;
  userId: any | undefined;
  cart: Cart | undefined;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserIdFromSessionStorage();
    if (this.userId !== undefined) {
      this.fetchCartItems();
    }
  }

  getUserIdFromSessionStorage() {
    if (typeof sessionStorage !== 'undefined') {
      const userObject = sessionStorage.getItem('currentUser');
      if (userObject) {
        this.userId = JSON.parse(userObject).id;
      } else {
        console.error('User ID not found in sessionStorage.');
      }
    } else {
      console.error('sessionStorage is not available.');
    }
  }

  fetchCartItems() {
    if (!this.userId) return;
    this.cartSubscription = this.http.get<Cart[]>('http://localhost:3000/cart?userId=' + this.userId).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.cart = response[0];
          console.log('Cart:', this.cart);
        } else {
          console.error('Empty response received from server.');
        }
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
      }
    });
  }
  
  placeOrder(cartId:any) {
    if (!this.cart || !this.userId) return;
  
    const order = {
      userId: this.userId,
      items: this.cart.items,
      total: this.cart.total,
      status: "Order Placed" 
    };
  
    this.http.post<any>('http://localhost:3000/orders', order).subscribe({
      next: (response) => {
        console.log('Order placed successfully:', response);
        this.cart = undefined;
        this.emptyCart(cartId)
      },
      error: (error) => {
        console.error('Error placing order:', error);
      }
    });
  }

  emptyCart(cartId: any) {
    this.http.patch(`http://localhost:3000/cart/${cartId}`, { items: [],total:0 }).subscribe({
      next: (response) => {
        console.log('Cart items emptied successfully:', response);
      },
      error: (error) => {
        console.error('Error emptying cart items:', error);
      }
    });
  }
  

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
