import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  showAdd = false;
  loading = false;
  error = '';
  filters = { search: '', role: 'all', status: 'all' };
  form = { name: '', email: '', username: '', password: '', role: 'user' };
  showPassword = false;
  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef, private router: Router) {}
  get admins() { return this.employees.filter((e) => e.role === 'admin').length; }
  ngOnInit() {
    this.load();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url.startsWith('/employees')) this.load();
    });
  }
  load() {
    this.loading = true;
    this.error = '';
    this.employeeService.list(this.filters).subscribe({
      next: (res) => {
        this.employees = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load employees.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  count(status: string) { return this.employees.filter((e) => e.status === status).length; }
  clear() { this.filters = { search: '', role: 'all', status: 'all' }; this.load(); }
  create() { this.employeeService.create(this.form).subscribe(() => { this.form = { name: '', email: '', username: '', password: '', role: 'user' }; this.showPassword = false; this.showAdd = false; this.load(); }); }
  role(e: any) { this.employeeService.updateRole(e._id, e.role).subscribe(() => this.load()); }
  toggle(e: any) { this.employeeService.updateStatus(e._id, e.status === 'active' ? 'inactive' : 'active').subscribe(() => this.load()); }
  remove(e: any) { if (confirm(`Delete ${e.name}?`)) this.employeeService.delete(e._id).subscribe(() => this.load()); }
}
