import { Component, inject, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../services/authservice';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cineif-navbar',
  imports: [RouterOutlet],
  templateUrl: './cineif-navbar.html',
  styleUrl: './cineif-navbar.scss',
})
export class CineifNavbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userLogado: Usuario | null = null;

  ngOnInit(): void {
    // this.authService.login('aluno@if.edu.br', '123');
    this.userLogado = this.authService.getUsuarioLogado();
    console.log(this.userLogado);
  }

  redirecionarPaginaDestino(destination: string) {
    this.router.navigate([destination]);
  }

  logout() {
    this.authService.logout();
    this.userLogado = null;
  }
}
