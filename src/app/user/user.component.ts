import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Cart {
  id: string;
  userId: number;
  items: CartItem[];
  total: number;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  menu: any;
  carts: Cart[] = [];
  userName:any ="";

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadMenu();
      this.loadCarts();
      this.showName()
    }
  }

  showName() {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      this.userName = JSON.parse(user).username;
      console.log(this.userName)
    } else {
      this.userName = "Customer";
    }
  }

  loadMenu() {
    this.userService.getMenu().subscribe((data: any) => {
      this.menu = data.categories;
    });
  }

  loadCarts() {
    this.http.get<Cart[]>('http://localhost:3000/cart').subscribe({
      next: (response) => {
        this.carts = response;
      },
      error: (error) => {
        console.error('Error fetching carts:', error);
      }
    });
  }

  addToCart(item: any) {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
      console.error('User not logged in.');
      return;
    }
    const userId = JSON.parse(currentUser).id;

    // Check if the user already has a cart
    const existingCart = this.carts.find(cart => cart.userId === userId);

    if (existingCart) {
      // Update the items array of the existing cart
      const existingItemIndex = existingCart.items.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
        // If the item is already in the cart, alert the user and return
        alert('This item is already in your cart.');
        return;
      }

      // If the item is not in the cart, add it to the cart
      const newItem: CartItem = {
        id: item.id,
        name: item.name,
        quantity: 1, // Assuming initial quantity is 1
        price: item.price
      };
      existingCart.items.push(newItem);

      // Update the total price of the cart
      existingCart.total += item.price;
      
      // Update the existing cart on the server
      this.updateCart(existingCart);
      
      // Display alert message
      alert(`${item.name} added to your cart.`);
    } else {
      // If the user doesn't have an existing cart, create a new cart object
      const newCart: Cart = {
        id: this.generateCartId(), // Generate a new ID for the cart
        userId: userId,
        items: [{
          id: item.id,
          name: item.name,
          quantity: 1,
          price: item.price
        }],
        total: item.price // Initial total equals the item price
      };

      // Add the new cart to the carts array
      this.carts.push(newCart);

      // Create a new cart on the server
      this.createCart(newCart);
      
      // Display alert message
      alert(`${item.name} added to your cart.`);
    }
  }


  updateCart(existingCart: Cart) {
    // Update the existing cart on the server
    this.http.put<any>('http://localhost:3000/cart/' + existingCart.id, existingCart).subscribe({
      next: (response) => {
        console.log('Cart updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating cart:', error);
      }
    });
  }

  createCart(newCart: Cart) {
    // Create a new cart on the server
    this.http.post<any>('http://localhost:3000/cart', newCart).subscribe({
      next: (response) => {
        console.log('Cart created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating cart:', error);
      }
    });
  }

  generateCartId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
