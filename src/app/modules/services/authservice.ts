import { Injectable } from '@angular/core';

export interface Usuario {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  senha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_USUARIOS = 'cineif_usuarios';
  private readonly STORAGE_LOGADO = 'cineif_usuario_logado';

  constructor() {
    // Inicializa com um usuário padrão caso não exista nenhum cadastrado
    if (!localStorage.getItem(this.STORAGE_USUARIOS)) {
      const usuariosIniciais: Usuario[] = [
        { nome: 'Usuário Teste IFTM', email: 'aluno@if.edu.br', telefone: '31999999999', senha: '123' }
      ];
      localStorage.setItem(this.STORAGE_USUARIOS, JSON.stringify(usuariosIniciais));
    }
  }

  getUsuarios(): Usuario[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_USUARIOS) || '[]');
  }

  cadastrar(usuario: Usuario): boolean {
    const usuarios = this.getUsuarios();
    const existe = usuarios.some(u => u.email === usuario.email);
    if (existe) return false;

    usuarios.push(usuario);
    localStorage.setItem(this.STORAGE_USUARIOS, JSON.stringify(usuarios));
    return true;
  }

  login(email: string, senha: string): Usuario | null {
    const usuarios = this.getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (usuario) {
      const { senha, ...usuarioSemSenha } = usuario;
      localStorage.setItem(this.STORAGE_LOGADO, JSON.stringify(usuarioSemSenha));
      return usuarioSemSenha;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_LOGADO);
  }

  getUsuarioLogado(): Usuario | null {
    const data = localStorage.getItem(this.STORAGE_LOGADO);
    return data ? JSON.parse(data) : null;
  }

  isLogado(): boolean {
    return !!this.getUsuarioLogado();
  }
}