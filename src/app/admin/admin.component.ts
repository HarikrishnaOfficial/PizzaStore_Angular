import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  menu: any;
  editingItem: any;
  newItem: any = { id: null, name: '', price: null, imageURL: '', category: '' };
  showAddFormFlag: boolean = false;

  constructor(private adminService: AdminService,
    private http: HttpClient ,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadMenu();
    }
  }

  loadMenu() {
    this.adminService.getMenu().subscribe((data: any) => {
      this.menu = data.categories;
    });
  }

  editItem(category: string, item: any) {
    const categoryItems = this.menu[category];
    if (categoryItems) {
      this.editingItem = { ...item };
    }
  }

  saveEdit() {
    const { category, id } = this.editingItem;
    const categoryItems = this.menu[category];
    if (categoryItems) {
      const index = categoryItems.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        categoryItems[index] = this.editingItem;
        this.menu[category] = categoryItems;
        this.updateMenuData();
        this.editingItem = null;
      }
    }
  }

  updateMenuData() {
    this.http.put('http://localhost:3000/menu', { categories: this.menu })
      .subscribe({
        next: (response: any) => {
          console.log('Menu updated successfully:', response);
        },
        error: (error: any) => {
          console.error('Error updating menu:', error);
        }
      });
  }

  deleteItem(category: string, itemId: any) {
    const categoryItems = this.menu[category];
    if (categoryItems) {
      const index = categoryItems.findIndex((item: any) => item.id === itemId);
      if (index !== -1) {
        categoryItems.splice(index, 1); // Remove the item from the local menu data

        // Send the updated menu data to the server
        this.http.put('http://localhost:3000/menu', { categories: this.menu })
          .subscribe({
            next: (response: any) => {
              console.log('Menu data updated successfully:', response);
              // Optionally, you can reload the menu data after successful update
              this.loadMenu();
            },
            error: (error: any) => {
              console.error('Error updating menu data:', error);
            }
          });
      }
    }
  }

  addItem(category: string) {
    this.showAddFormFlag = true;
    this.newItem.category = category;
  }

  cancelAddForm() {
    this.newItem = { id: null, name: '', price: null, imageURL: '', category: '' };
    this.showAddFormFlag = false;
  }

  saveNewItem() {
    this.adminService.addItem(this.newItem.category, this.newItem);
    this.newItem = { id: null, name: '', price: null, imageURL: '', category: '' };
    this.showAddFormFlag = false; 
  }
}
