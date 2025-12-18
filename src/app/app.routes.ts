import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { PolicyComponent } from './features/auth/policy/policy.component';
import { MainComponent } from './features/mainPanel/main/main.component';
import { AuthGuardService } from './core/auth/guards/authGuard/auth-guard.service';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { VerifyAccountComponent } from './features/auth/verify-account/verify-account.component';
import { SetNewPasswordComponent } from './features/auth/set-new-password/set-new-password.component';
import { AdminDashboardComponent } from './features/mainPanel/admin/admin-dashboard.component';
import { PatientDashboardComponent } from './features/mainPanel/patient/patient-dashboard.component';
import { DoctorDashboardComponent } from './features/mainPanel/doctor/doctor-dashboard.component';

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
        canActivate: [AuthGuardService],
        children: [
            {path: 'adminDashboard', component: AdminDashboardComponent},
            {path: 'patientDashboard', component: PatientDashboardComponent},
            {path: 'doctorDashboard', component: DoctorDashboardComponent},
        ]
    }
];
