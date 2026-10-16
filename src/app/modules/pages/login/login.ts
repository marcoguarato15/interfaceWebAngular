import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authservice';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  erroLogin = false;

  email = '';
  senha = '';

  login(){
    const usuario = this.authService.login(this.email, this.senha);
  
    if (usuario) {
      this.erroLogin = false;
      this.redirectDestinationPage('/');
    } else {
      this.erroLogin = true;
    }
  }

  redirectDestinationPage(destination: string) {
    this.router.navigate([destination]);
  }
}
