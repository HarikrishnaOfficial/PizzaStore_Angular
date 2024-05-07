import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { NavbarComponent } from './userSection/navbar/navbar.component';
import { CartComponent } from './userSection/cart/cart.component';
import { OrdersComponent } from './userSection/orders/orders.component';
import { AdminNavComponent } from './adminSection/admin-nav/admin-nav.component';
import { RevinueComponent } from './adminSection/revinue/revinue.component';
import { AllUserOrdersComponent } from './adminSection/all-user-orders/all-user-orders.component';
import { AppRoutingModule } from './app-routing.module';
import { EditAddItemComponent } from './adminSection/edit-add-item/edit-add-item.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    LoginComponent,
    NavbarComponent,
    CartComponent,
    OrdersComponent,
    AdminNavComponent,
    RevinueComponent,
    AllUserOrdersComponent,
    EditAddItemComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
