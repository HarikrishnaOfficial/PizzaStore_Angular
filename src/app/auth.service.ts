import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  login(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // Check if user is admin
      this.http.get<any[]>(`${this.apiUrl}/admin?username=${username}&password=${password}`)
        .pipe(
          map(admin => {
            if (admin && admin.length > 0) {
              const currentUser = admin[0];
              this.setLoggedInUser(currentUser);
              // Navigate to admin page if the user is an admin
              this.router.navigate(['/admin']);
              resolve(true);
            } else {
              // If user is not found in the admin array, check in the users array
              this.http.get<any[]>(`${this.apiUrl}/users?username=${username}&password=${password}`)
                .pipe(
                  map(users => {
                    if (users && users.length > 0) {
                      const currentUser = users[0];
                      this.setLoggedInUser(currentUser);
                      // Navigate to user page if the user is not an admin
                      this.router.navigate(['/user']);
                      resolve(true);
                    } else {
                      // User not found in both admin and users arrays
                      resolve(false);
                    }
                  }),
                  catchError(error => {
                    console.error('Error during login:', error);
                    reject(false);
                    return of(false);
                  })
                )
                .subscribe();
            }
          }),
          catchError(error => {
            console.error('Error during login:', error);
            reject(false);
            return of(false);
          })
        )
        .subscribe();
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('currentUser'); // Change to sessionStorage
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!sessionStorage.getItem('currentUser'); // Change to sessionStorage
    }
    return false; // Return false if not in the browser environment
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}'); // Change to sessionStorage
      return currentUser.username === 'admin';
    }
    return false; // Return false if not in the browser environment
  }

  private setLoggedInUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('currentUser', JSON.stringify(user)); // Change to sessionStorage
    }
  }
}
