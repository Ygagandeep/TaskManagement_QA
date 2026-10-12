import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = { username: '', password: '' };
  error = '';
  success = '';
  submitted = false;
  loading = false;
  showPassword = false;
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    if (this.route.snapshot.queryParamMap.get('registered') === 'success') {
      this.success = 'Register success. Please login now.';
    }
  }
  isInvalid(control: NgModel) {
    return Boolean(control.invalid) && (control.touched || this.submitted);
  }
  login(loginForm: NgForm) {
    this.submitted = true;
    this.error = '';
    this.success = '';
    if (loginForm.invalid) {
      this.error = 'Please enter username and password.';
      this.cdr.detectChanges();
      return;
    }
    this.loading = true;
    this.cdr.detectChanges();
    this.auth.login(this.form).subscribe({
      next: () => {
        this.success = 'Login success. Opening dashboard...';
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/dashboard']), 500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please check username and password.';
        this.cdr.detectChanges();
      }
    });
  }
}
