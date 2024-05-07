import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  username: string = '';
  password: string = '';

  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) { }

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addUser(newUser: any) {
    return this.http.post(this.apiUrl, newUser);
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  register() {
    this.getUsers().subscribe(
      (users: any[]) => {
        const maxId = Math.max(...users.map(user => +user.id)); // Get the maximum ID
        const newUser = {
          id: (maxId + 1).toString(),
          username: this.username,
          password: this.password
        };
        this.addUser(newUser).subscribe(
          (response) => {
            alert('Registration successful');
            this.navigateToLogin()
          },
          (error) => {
            alert('Registration Failed')
            console.error('Registration failed:', error);
          }
        );
      },
      (error) => {
        console.error('Failed to fetch users:', error);
      }
    );
  }

  
}

