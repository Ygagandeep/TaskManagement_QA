import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessService } from '../../core/services/access.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.css']
})
export class AccessManagementComponent implements OnInit {
  rows: any[] = [];
  search = '';
  loading = false;
  message = '';
  error = '';
  savingUserId = '';
  readonly adminOnlyKeys = ['employeeManagement', 'accessManagement'];
  columns = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'employeeManagement', label: 'Employee Management' },
    { key: 'projectManagement', label: 'Project Management' },
    { key: 'taskManagement', label: 'Task Management' },
    { key: 'reports', label: 'Reports' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'fileUpload', label: 'File Upload' },
    { key: 'settings', label: 'Settings' },
    { key: 'accessManagement', label: 'Access Management' }
  ];
  constructor(private accessService: AccessService, private cdr: ChangeDetectorRef) {}
  get filtered() {
    const s = this.search.toLowerCase();
    return this.rows.filter((row) => !s || row.user.name.toLowerCase().includes(s) || row.user.email.toLowerCase().includes(s));
  }
  ngOnInit() { this.load(); }
  load() {
    this.loading = true;
    this.message = '';
    this.error = '';
    this.accessService.list().subscribe({
      next: (res) => {
        this.rows = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load access details';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  isAdmin(row: any) {
    return row.user?.role === 'admin';
  }
  isLocked(row: any, key: string) {
    return this.isAdmin(row) || (row.user?.role !== 'admin' && this.adminOnlyKeys.includes(key));
  }
  isOn(row: any, key: string) {
    if (this.isAdmin(row)) return true;
    return row.access?.[key] === true || row.access?.[key] === 'true';
  }
  lockText(row: any, key: string) {
    if (this.isAdmin(row)) return 'Admin users always have full access';
    if (this.adminOnlyKeys.includes(key)) return 'Only admin role can use this page';
    return this.isOn(row, key) ? 'Turn access off' : 'Turn access on';
  }
  toggle(row: any, key: string) {
    if (this.isLocked(row, key)) return;

    const access = this.columns.reduce((current: Record<string, boolean>, col) => {
      current[col.key] = this.isOn(row, col.key);
      return current;
    }, {});
    access[key] = !this.isOn(row, key);

    this.savingUserId = row.user._id;
    this.message = '';
    this.error = '';
    this.accessService.update(row.user._id, access).subscribe({
      next: (updated) => {
        row.access = updated;
        this.savingUserId = '';
        this.message = `Access updated for ${row.user.name}`;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.savingUserId = '';
        this.error = err.error?.message || 'Unable to update access';
        this.cdr.detectChanges();
      }
    });
  }
}
