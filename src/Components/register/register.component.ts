import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GenericService } from '../../Services/generic.service';
import { CreateUserModel } from '../../Models/create-user-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private service: GenericService, private router: Router) {

  }

  CreateUserRequestModel: CreateUserModel = {
    NameSurname: "",
    password: "",
    passwordRe: "",
    userName: "",
  };

  RegisterUser() {
    this.service.Post("Users", this.CreateUserRequestModel).subscribe({
      next: (data) => {
        alert("Kayıt Başarılı...!");
        this.router.navigateByUrl("login");

      },
      error: (response) => {
        alert(response.error.payload);
      }
    })
  }


}
