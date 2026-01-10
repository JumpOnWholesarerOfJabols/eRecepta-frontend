import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { ListItemComponent } from '../../../shared/components/list-item/list-item.component';
import { User } from '../../../core/models/UserData';
import { AdminService } from '../../../core/services/adminService/admin.service';
import { AuthService } from '../../../core/auth/services/authService/auth.service';
import { SnackbarService } from '../../../core/services/snackbarService/snackbar.service';
import { CreateUserComponent } from './create-user/create-user.component';
import { ManageMedicationComponent } from './manage-medication/manage-medication.component';

enum ACTIONS {
    SHOW_USERS,
    ADD_USER,
    MANAGE_MEDICATIONS,
}

@Component({
    selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
    standalone: true,
    imports: [MatButtonModule, MatCardModule, MatIconModule, ListItemComponent, CreateUserComponent, ManageMedicationComponent]
})
export class AdminDashboardComponent implements OnInit {
    
    constructor(
        private adminService: AdminService, 
        private authS: AuthService,
        private snackbar: SnackbarService
    ) {}
    
    protected allUsers: User[] | null = null;
    ACTIONS = ACTIONS;
    action: ACTIONS = ACTIONS.SHOW_USERS; 

    ngOnInit() {
        this.fetchAllUsers();
    }

    addNewUser() {
        this.action = ACTIONS.ADD_USER;
    }

    showAllUsers() {
        this.action = ACTIONS.SHOW_USERS;
        // Ensure list refreshes when toggling back
        this.fetchAllUsers();
    }

    deleteUser(id: String) {
        this.adminService.deleteUser(id).subscribe({
            next: (result) => {
                if(result.data?.deleteUser.success) {
                    this.allUsers = (this.allUsers ?? []).filter((user) => user.id !== id)
                    this.snackbar.openSnackBar("User deleted successfully")
                } else {
                    //error
                }
            },
            error: (err) => {
            }
        })
    }

    fetchAllUsers() {
        this.adminService.getAllUsers().subscribe({
            next: (value) => {
                if(value.data && Array.isArray(value.data.getAllUsers)) {
                    this.allUsers = value.data.getAllUsers;
                } else {
                    //error
                }
            },
        })
    }

    editMedications() {
        this.action = ACTIONS.MANAGE_MEDICATIONS;
    }

}
