import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/authservice';
import { Router } from '@angular/router';

const senhasIguais: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const senha = grupo.get('senha')?.value;
  const confirmarSenha = grupo.get('confirmarSenha')?.value;
  return senha === confirmarSenha ? null : { senhasDiferentes: true };
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  erroCadastro = '';

  redirecionarPaginaDestino(destination: string) {
  this.router.navigate([destination]);
}

cadastrar() {
  // 1) Formulário inválido? Mostra todos os erros e para.
  if (this.formCadastro.invalid) {
    this.formCadastro.markAllAsTouched();
    return;
  }

  // 2) Pega os valores digitados e tenta cadastrar
  const { nome, cpf, email, senha } = this.formCadastro.getRawValue();
  const cadastrou = this.authService.cadastrar({ nome, cpf, email, senha });

  if (cadastrou) {
    // 3) Deu certo: faz o login automático e vai para a Home
    this.authService.login(email, senha);
    this.redirecionarPaginaDestino('/');
  } else {
    // 4) O e-mail já existe
    this.erroCadastro = 'Já existe um usuário cadastrado com este e-mail.';
  }
}

  formCadastro = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]],
  },
  { validators: senhasIguais });

  get nome() { return this.formCadastro.controls.nome; }
  get cpf() { return this.formCadastro.controls.cpf; }
  get email() { return this.formCadastro.controls.email; }
  get senha() { return this.formCadastro.controls.senha; }
  get confirmarSenha() { return this.formCadastro.controls.confirmarSenha; }
}