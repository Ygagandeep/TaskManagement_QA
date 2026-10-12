import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { accessGuard } from './core/guards/access.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { FileUploadComponent } from './pages/file-upload/file-upload.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AccessManagementComponent } from './pages/access-management/access-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [accessGuard], data: { accessKey: 'dashboard' } },
      { path: 'projects', component: ProjectsComponent, canActivate: [accessGuard], data: { accessKey: 'projectManagement' } },
      { path: 'tasks', component: TasksComponent, canActivate: [accessGuard], data: { accessKey: 'taskManagement' } },
      { path: 'employees', component: EmployeesComponent, canActivate: [accessGuard], data: { accessKey: 'employeeManagement' } },
      { path: 'reports', component: ReportsComponent, canActivate: [accessGuard], data: { accessKey: 'reports' } },
      { path: 'notifications', component: NotificationsComponent, canActivate: [accessGuard], data: { accessKey: 'notifications' } },
      { path: 'file-upload', component: FileUploadComponent, canActivate: [accessGuard], data: { accessKey: 'fileUpload' } },
      { path: 'settings', component: SettingsComponent, canActivate: [accessGuard], data: { accessKey: 'settings' } },
      { path: 'access-management', component: AccessManagementComponent, canActivate: [accessGuard], data: { accessKey: 'accessManagement' } }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
