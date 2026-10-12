import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = { name: '', email: '', username: '', password: '' };
  confirm = '';
  error = '';
  success = '';
  submitted = false;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  constructor(private auth: AuthService, private router: Router) {}
  get passwordMismatch() {
    return this.submitted && Boolean(this.confirm) && this.form.password !== this.confirm;
  }
  isInvalid(control: NgModel) {
    return Boolean(control.invalid) && (control.touched || this.submitted);
  }
  register(registerForm: NgForm) {
    this.submitted = true;
    this.error = '';
    this.success = '';
    if (registerForm.invalid) { this.error = 'Please correct the required fields shown in red.'; return; }
    if (this.form.password !== this.confirm) { this.error = 'Passwords do not match'; return; }
    this.loading = true;
    this.auth.register(this.form).subscribe({
      next: () => {
        this.success = 'Register success. Redirecting to login...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login'], { queryParams: { registered: 'success' } }), 900);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Register failed. Please check backend connection and try again.';
      }
    });
  }
}
