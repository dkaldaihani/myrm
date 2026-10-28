import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  username = '';
  password = '';

  errorMessage = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit() {
    this.errorMessage.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/customers']),
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage.set('Invalid username or password');
        } else {
          this.errorMessage.set('Could not reach the server. Is the backend running?');
        }
      },
    });
  }
}
