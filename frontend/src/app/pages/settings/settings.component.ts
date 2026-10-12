import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SettingService } from '../../core/services/setting.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  profile = { name: '', email: '' };
  settings: any = {};
  password = { currentPassword: '', newPassword: '' };
  deletePassword = '';
  message = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showDeletePassword = false;
  constructor(private settingService: SettingService, private auth: AuthService, private cdr: ChangeDetectorRef) {}
  ngOnInit() { const user = this.auth.currentUser(); this.profile = { name: user?.name || '', email: user?.email || '' }; this.load(); }
  load() {
    this.settingService.get().subscribe((res) => {
      this.settings = res || {};
      this.applyTheme(this.settings.theme || 'light');
      this.cdr.detectChanges();
    });
  }
  saveProfile() { this.settingService.profile(this.profile).subscribe((user: any) => { localStorage.setItem('user', JSON.stringify(user)); this.message = 'Profile saved'; }); }
  changePassword() { this.settingService.password(this.password).subscribe(() => { this.message = 'Password changed'; this.password = { currentPassword: '', newPassword: '' }; this.showCurrentPassword = false; this.showNewPassword = false; }); }
  save() { this.settingService.save(this.settings).subscribe((res) => { this.settings = res; this.applyTheme(this.settings.theme || 'light'); this.message = 'Settings saved'; this.cdr.detectChanges(); }); }
  setTheme(theme: 'light' | 'dark') {
    this.settings.theme = theme;
    this.applyTheme(theme);
    this.settingService.save(this.settings).subscribe((res) => {
      this.settings = res;
      this.applyTheme(this.settings.theme || theme);
      this.message = `${theme === 'dark' ? 'Dark' : 'Light'} mode applied`;
      this.cdr.detectChanges();
    });
  }
  applyTheme(theme: string) {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    localStorage.setItem('theme', selectedTheme);
    document.body.classList.toggle('dark-theme', selectedTheme === 'dark');
  }
  deleteAccount() { if (confirm('Delete your account permanently?')) this.settingService.deleteAccount(this.deletePassword).subscribe(() => this.auth.logout()); }
}
