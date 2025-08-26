import { Component } from '@angular/core';
import { GenericService } from '../../Services/generic.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginUserModel } from '../../Models/login-user-model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  LoginuserRequestModel: LoginUserModel = {
    password: "",
    userName: ""
  };
  constructor(private service: GenericService, private router: Router) {

  }
  SignIn() {
    this.service.Post("Users/LoginUser", this.LoginuserRequestModel).subscribe({
      next: () => {
        alert("Giriş başarılı...!");
        

        this.router.navigateByUrl("home");
      },
      error: (res) => {
        alert(res.error.payload);
      }
    });
  }
}
