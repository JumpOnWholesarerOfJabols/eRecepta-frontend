import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PolicyComponent } from './pages/auth/policy/policy.component';
import { MainComponent } from './pages/mainPanel/main/main.component';
import { AuthGuardService } from './guards/authGuard/auth-guard.service';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { VerifyAccountComponent } from './pages/auth/verify-account/verify-account.component';
import { SetNewPasswordComponent } from './pages/auth/set-new-password/set-new-password.component';

export const routes: Routes = [
    { 
        path: '',
        component: HomeComponent,
        children: [
            { path: '', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'policy', component: PolicyComponent},
            { path: 'resetPassword', component: ForgotPasswordComponent},
            { path: 'verifyAccount', component: VerifyAccountComponent},
            { path: 'setNewPassword', component: SetNewPasswordComponent},
        ],
    },
    {
        path: 'main',
        component: MainComponent,
        canActivate: [AuthGuardService]
    }
];
