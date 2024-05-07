import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

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
  delivered?: boolean; // Optional property to track delivery status
}

@Component({
  selector: 'app-all-user-orders',
  templateUrl: './all-user-orders.component.html',
  styleUrls: ['./all-user-orders.component.css']
})
export class AllUserOrdersComponent implements OnInit, OnDestroy {
  private ordersSubscription: Subscription | undefined;
  orders: Orders[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchOrdersItems();
  }

  fetchOrdersItems() {
    this.ordersSubscription = this.http.get<Orders[]>('http://localhost:3000/orders').subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.orders = response;
        } else {
          console.error('Empty response received from server.');
        }
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }
  acceptOrder(orderId:any){
    const orderToAccept = this.orders.find(order => order.id === orderId);
    if (orderToAccept) {
      orderToAccept.status = 'Accepted';
      this.http.put<any>(`http://localhost:3000/orders/${orderId}`, orderToAccept).subscribe({
        next: () => {
          console.log(`Order ${orderId} Accepted successfully.`);
        },
        error: (error) => {
          console.error('Error Accepteding order:', error);
          orderToAccept.status = 'Order Acception Failed';
        }
      });
    } else {
      console.error(`Order with ID ${orderId} not found.`);
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

  generateBill(order: Orders): void {
    const billContent = document.createElement('div');
    billContent.innerHTML = `
      <style>
        .bill-container {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        .bill-header {
          text-align: center;
          font-size: 8px;
          margin-bottom: 10px;
        }
        .bill-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        .bill-table th, .bill-table td {
          border: 1px solid #dddddd;
          padding: 4px;
          text-align: left;
        }
        .bill-table th {
          background-color: #f2f2f2;
        }
      </style>
      <div class="bill-container">
        <div class="bill-header">Order Details</div>
        <div class="bill-header">Order ID: ${order.id}</div>
        <div class="bill-header">Status: ${order.status}</div>
        <table class="bill-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.quantity * item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <br>
        <div class="bill-header">Total Amount: ${order.total}</div>
      </div>
    `;
  
    const pdf = new jsPDF();
    pdf.html(billContent, {
      callback: (pdf) => {
        pdf.save(`bill_${order.id}.pdf`);
      }
    });
  }
  
  markAsDelivered(orderId: any, total: number) {
    const orderToDelivered = this.orders.find(order => order.id === orderId);
    if (orderToDelivered) {
      // Step 1: Update order status to 'Delivered'
      orderToDelivered.status = 'Delivered';
  
      // Step 2: Send PUT request to update order status
      this.http.put<any>(`http://localhost:3000/orders/${orderId}`, orderToDelivered).subscribe({
        next: () => {
          // Step 3: Update revenue for the current month
          this.updateRevenueForCurrentMonth(total);
          alert(`Order ${orderId} Delivered successfully.`);
        },
        error: (error) => {
          console.error('Error updating order status:', error);
          orderToDelivered.status = 'Order Delivery failed';
        }
      });
    } else {
      console.error(`Order with ID ${orderId} not found.`);
    }
  }
  
  updateRevenueForCurrentMonth(total: number) {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' }); // Get the current month name
    const revenueEndpoint = 'http://localhost:3000/revenue';
  
    // Step 4: Fetch current revenue data
    this.http.get<any>(revenueEndpoint).subscribe(
      (revenueData) => {
        // Add the order total to the revenue of the current month
        revenueData[currentMonth] += total;
  
        // Send PUT request to update revenue data
        this.http.put(revenueEndpoint, revenueData).subscribe(
          () => {
            console.log(`Revenue updated for ${currentMonth} with amount ${total}.`);
          },
          (error) => {
            console.error('Error updating revenue:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching revenue data:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }
}
