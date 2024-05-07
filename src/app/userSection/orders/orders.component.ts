import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';

interface OrdersItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Orders {
  id: string;
  userId: number;
  items: OrdersItem[];
  total: number;
  status: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private ordersSubscription: Subscription | undefined;
  userId: number | undefined;
  orders: Orders[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserIdFromSessionStorage();
    if (this.userId !== undefined) {
      this.fetchOrdersItems();
    } else {
      console.error('User ID is not available.');
      // Handle the absence of user ID, such as displaying an error message to the user
    }
  }

  getUserIdFromSessionStorage() {
    if (typeof sessionStorage !== 'undefined') {
      const userObjectString = sessionStorage.getItem('currentUser');
      if (userObjectString) {
        const userObject = JSON.parse(userObjectString);
        if (userObject && userObject.id) {
          this.userId = userObject.id;
        } else {
          console.error('User ID not found in currentUser object.');
        }
      } else {
        console.error('currentUser object not found in sessionStorage.');
      }
    } else {
      console.error('sessionStorage is not available for orders');
    }
  }

  fetchOrdersItems() {
    if (this.userId !== undefined) {
      this.ordersSubscription = this.http.get<Orders[]>('http://localhost:3000/orders?userId=' + this.userId).subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.orders = response;
            console.log(this.orders);
          } else {
            console.error('Empty response received from server.');
          }
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        }
      });
    } else {
      console.error('User ID is not available.');
    }
  }
  
  cancelOrder(orderId: any) {
    const orderToCancel = this.orders.find(order => order.id === orderId);
    if (orderToCancel) {
      orderToCancel.status = 'Canceled';
      this.http.put<any>(`http://localhost:3000/orders/${orderId}`, orderToCancel).subscribe({
        next: () => {
          console.log(`Order ${orderId} canceled successfully.`);
        },
        error: (error) => {
          console.error('Error canceling order:', error);
          orderToCancel.status = 'Order cancellation failed';
        }
      });
    } else {
      console.error(`Order with ID ${orderId} not found.`);
    }
  }

  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }
}
