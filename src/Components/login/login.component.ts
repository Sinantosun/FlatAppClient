import { Component } from '@angular/core';
import { GenericService } from '../../Services/generic.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginUserModel } from '../../Models/login-user-model';
import { CreateUserModel } from '../../Models/create-user-model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Login için model
  LoginuserRequestModel: LoginUserModel = {
    password: "",
    userName: ""
  };
  
  // Register için model
  CreateUserRequestModel: CreateUserModel = {
    NameSurname: "",
    password: "",
    passwordRe: "",
    userName: "",
  };
  
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isRegisterMode: boolean = false;

  constructor(private service: GenericService, private router: Router) { }

  // Giriş yapma fonksiyonu
  SignIn() {
    // Form validasyonu
    if (!this.LoginuserRequestModel.userName || !this.LoginuserRequestModel.password) {
      this.errorMessage = 'Lütfen kullanıcı adı ve şifre giriniz.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.service.Post("Users/LoginUser", this.LoginuserRequestModel).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Giriş başarılı! Yönlendiriliyorsunuz...';
        setTimeout(() => {
          this.router.navigateByUrl("home");
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.payload || 'Giriş sırasında bir hata oluştu.';
        console.error('Login error:', err);
      }
    });
  }

  // Kayıt olma fonksiyonu
  RegisterUser() {
    // Form validasyonu
    if (!this.CreateUserRequestModel.NameSurname || 
        !this.CreateUserRequestModel.userName || 
        !this.CreateUserRequestModel.password) {
      this.errorMessage = 'Lütfen tüm alanları doldurunuz.';
      return;
    }
    
    if (this.CreateUserRequestModel.password !== this.CreateUserRequestModel.passwordRe) {
      this.errorMessage = 'Şifreler eşleşmiyor.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.service.Post("Users", this.CreateUserRequestModel).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Kayıt başarılı! Giriş yapabilirsiniz.';
        
        // Otomatik olarak login moduna geç
        setTimeout(() => {
          this.isRegisterMode = false;
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.payload || 'Kayıt sırasında bir hata oluştu.';
        console.error('Register error:', err);
      }
    });
  }

  // Mod değiştirme (Login/Register)
  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
  }
}