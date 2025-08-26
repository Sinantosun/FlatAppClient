import { Routes } from '@angular/router';
import { LoginComponent } from '../Components/login/login.component';
import { AuthGuard } from '../Guards/auth.guard';
import { RegisterComponent } from '../Components/register/register.component';
import { MessageComponent } from '../Components/message/message.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "home",
        component: MessageComponent,
        canActivate: [AuthGuard]
    }

];
