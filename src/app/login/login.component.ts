import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password)
      .then((loggedIn: boolean) => {
        if (!loggedIn) {
          alert("Inavlid credentials")
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
      });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
