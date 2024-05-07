import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getMenu() {
    return this.http.get(`${this.apiUrl}/menu`);
  }

  addItem(category: string, newItem: any) {
    this.http.get(`${this.apiUrl}/menu`).subscribe((data: any) => {
      const existingCategories = data.categories || {};
      const existingItems = existingCategories[category] || [];
      let maxId = 0;
  
      // Find the maximum ID in the existing items of the "beverages" category
      const beveragesItems = existingCategories['beverages'] || [];
      beveragesItems.forEach((item: any) => {
        if (item.id > maxId) {
          maxId = item.id;
        }
      });
  
      // Find the maximum ID in the existing items of the "sides" category
      const sidesItems = existingCategories['sides'] || [];
      sidesItems.forEach((item: any) => {
        if (item.id > maxId) {
          maxId = item.id;
        }
      });
  
      // Find the maximum ID in the existing items of the "pizza" category
      const pizzaItems = existingCategories['pizza'] || [];
      pizzaItems.forEach((item: any) => {
        if (item.id > maxId) {
          maxId = item.id;
        }
      });
  
      // Assign a new ID by incrementing the maximum ID
      newItem.id = maxId + 1;
  
      // Add the new item to the category
      existingItems.push(newItem);
  
      // Update the category with the new item added
      existingCategories[category] = existingItems;
      this.http.put(`${this.apiUrl}/menu`, { categories: existingCategories }).subscribe({
        next: (response: any) => {
          console.log('Item added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding item:', error);
        }
      });
    });
  }
  
}
