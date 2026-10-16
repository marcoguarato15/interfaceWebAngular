# 🎬 Exercício Prático: Cineif — Seu Primeiro Projeto em Angular

Neste exercício você vai construir o **Cineif**, um site fictício de cinema com **barra de navegação**, **tela de login**, **tela de cadastro** e uma **lista de lançamentos**. No caminho, vamos aprender os conceitos fundamentais do Angular:

| Conceito (Português) | Concept (English) | Onde vamos usar |
|---|---|---|
| Diretiva Condicional IF | Conditional Directive `@if` | Etapa 1 — Navbar |
| Interpolação / Vinculação de Dados Unidirecional | Interpolation / One-Way Data Binding | Etapa 1 — Navbar |
| Evento de Clique | Click Event | Etapa 1 — Navbar |
| Formulário Orientado a Template | Template-Driven Form (`ngModel`) | Etapa 2 — Login |
| Vinculação de Dados Bidirecional | Two-Way Data Binding | Etapa 2 — Login |
| Formulário Reativo | Reactive Form (`FormGroup`) | Etapa 3 — Cadastro |
| Diretiva de Repetição FOR | Repeat Directive `@for` | Etapa 4 — Home |

> 💡 **Sobre os nomes dos arquivos:** este projeto usa o **Angular 20**. Nele, os arquivos **não** levam o sufixo `.component` (ex.: `home.ts` e não `home.component.ts`) e as classes têm nomes curtos (`Home`, `Login`). Se você pesquisar tutoriais antigos na internet, vai ver `HomeComponent`, `*ngIf`, `*ngFor` e `NgModule`: o conceito é o mesmo, mas a escrita mudou. Ao longo do roteiro vamos mostrar **a forma nova e como era feito antes**.

---

## 🧰 Antes de Começar

**Pré-requisitos:** Node.js (versão LTS), editor de código (VS Code) e navegador (Chrome ou Firefox).

**1. Instale as dependências e execute o projeto base** (na pasta do projeto):

```bash
npm install
npm start
```

**2. Acesse** `http://localhost:4200`. A cada arquivo salvo, a página recarrega sozinha.

**3. Usuário de teste** (já cadastrado no `AuthService`):

| E-mail | Senha |
|---|---|
| `aluno@if.edu.br` | `123` |

> 🔎 **Ferramenta importante:** abra as **ferramentas do desenvolvedor** com `F12`.
> - Aba **Console**: mostra erros e mensagens do `console.log`.
> - Aba **Application → Local Storage → localhost:4200**: mostra os dados que o nosso "banco de dados de mentira" guarda no navegador (`cineif_usuarios` e `cineif_usuario_logado`).

---

# 📘 Parte 0 — Conhecendo o Projeto (Estrutura Básica / Basic Project Structure)

## 0.1 Como o projeto nasce: o comando `ng new`

Todo projeto Angular começa com o **Angular CLI** (a ferramenta de linha de comando):

```bash
npm install -g @angular/cli
ng new cineif
```

O CLI faz algumas perguntas (formato de estilo, SSR...). Neste projeto escolhemos **SCSS** para os estilos e **não** habilitamos SSR. O comando cria toda a estrutura inicial. **Você não precisa executá-lo agora**: o projeto base já foi criado e acrescido de alguns arquivos (bootstrap, imagens e o serviço de autenticação).

## 0.2 Estrutura de pastas

```text
cineif/
├── angular.json            ← configurações do projeto Angular
├── package.json            ← dependências e scripts (npm start, npm run build...)
├── tsconfig.json           ← configurações do TypeScript
├── public/                 ← arquivos estáticos (favicon, imagens)
│   └── assets/
│       ├── logo-cineif.png
│       └── logo-cineif-white.png
└── src/
    ├── index.html          ← página HTML única da aplicação
    ├── main.ts             ← ponto de entrada (primeiro código executado)
    ├── styles.scss         ← estilos GLOBAIS
    └── app/
        ├── app.ts          ← componente raiz (App)
        ├── app.html
        ├── app.scss
        ├── app.config.ts   ← configurações globais da aplicação
        ├── app.routes.ts   ← tabela de rotas
        └── modules/
            ├── services/
            │   └── authservice.ts          ← cadastro/login (já pronto)
            ├── layout/
            │   └── cineif-navbar/          ← barra de navegação
            └── pages/
                ├── home/                   ← página inicial
                └── login/                  ← página de login
```

## 0.3 Os arquivos iniciais

### `src/index.html`
É a **única página HTML** do projeto (por isso o Angular cria *Single Page Applications* — **SPA**, aplicações de página única). Repare na tag dentro do `<body>`:

```html
<app-root></app-root>
```

`<app-root>` é uma tag criada pelo Angular. É nela que a nossa aplicação inteira será desenhada.

### `src/styles.scss`
Estilos **globais**, aplicados a todas as telas. Aqui o projeto já importa o **Bootstrap** (classes prontas como `btn`, `alert`, `form-control`) e os **Bootstrap Icons** (ícones como `bi-person-circle`).

### `src/main.ts`
É o **primeiro arquivo que roda**. Ele "liga" a aplicação:

```ts
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

Em português: *"inicie a aplicação usando o componente **`App`** como componente principal"*. Ou seja, o `main.ts` **direciona o projeto para o componente `App`**, que é quem aparece dentro da tag `<app-root>` do `index.html`.

### `src/app/app.config.ts`
Configurações globais da aplicação. A linha que nos interessa é `provideRouter(routes)`, que ativa o sistema de rotas usando a lista definida em `app.routes.ts`.

## 0.4 Anatomia de um Componente (Component Anatomy)

O **componente** é o bloco de construção do Angular: cada "pedaço" da tela (barra de navegação, página de login...) é um componente. Veja o componente raiz, `app.ts`:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
```

Um componente é formado por **3 arquivos + a classe**:

| Parte | Arquivo | Função |
|---|---|---|
| Lógica (Typescript) | `app.ts` | Variáveis e funções do componente |
| Visual (Template) | `app.html` | O que aparece na tela |
| Estilo | `app.scss` | O CSS **só deste componente** |

E a anotação (decorator) **`@Component({...})`** é quem "avisa" ao Angular que a classe é um componente e como ele funciona:

| Propriedade | Para que serve |
|---|---|
| `selector` | O nome da **tag HTML** do componente (`<app-root>`). Para usar um componente dentro de outro, escrevemos o seu selector. |
| `imports` | A lista de **outros componentes, diretivas e módulos** que o HTML deste componente pode usar. *Se usar algo no HTML e não importar aqui, o Angular dá erro!* |
| `templateUrl` | Caminho do arquivo HTML. (Alternativa: `template`, com o HTML escrito direto dentro do `.ts`.) |
| `styleUrl` | Caminho do arquivo de estilo. (Alternativa: `styles`.) |

### 🧪 Sobre os arquivos `.spec.ts`

Quando você gera um componente com o CLI, ele cria também um arquivo `nome_do_componente.spec.ts`. É nele que se escrevem os **testes unitários** (*unit tests*). **Por falta de tempo, não vamos abordar testes neste exercício.** Por isso:

- O projeto base **já está sem** os arquivos `.spec.ts`;
- Nos componentes novos, excluí-los é **opcional**. Você pode apagá-los ou, melhor, já gerar o componente sem eles com a opção `--skip-tests` (veremos na Etapa 3).

## 0.5 Rotas (Routes) — `app.routes.ts`

Uma **rota** é a ligação entre **um endereço (URL)** e **um componente**: *"quando o usuário acessar `/login`, mostre o componente `Login`"*. Sem rotas, a aplicação teria uma tela só.

```ts
export const routes: Routes = [
  {
    path: '',                    // endereço: http://localhost:4200/
    component: CineifNavbar,     // componente "moldura" (tem a navbar)
    children: [
      { path: '', component: Home },   // dentro da moldura aparece a Home
    ],
  },
  {
    path: 'login',               // endereço: http://localhost:4200/login
    component: Login,
  },
];
```

**Onde o componente da rota aparece?** Na tag **`<router-outlet />`** (a "saída do roteador"). Ela funciona como um **espaço reservado**: o Angular troca o que está dentro dela conforme a URL.

O `<router-outlet />` do projeto está no `app.html`:

```html
<router-outlet />
```

Veja como as peças se encaixam:

```text
URL  /                          URL  /login
┌─────────────────────────┐     ┌─────────────────────────┐
│ App                     │     │ App                     │
│  <router-outlet>        │     │  <router-outlet>        │
│  ┌───────────────────┐  │     │  ┌───────────────────┐  │
│  │ CineifNavbar      │  │     │  │ Login             │  │
│  │  (barra no topo)  │  │     │  │                   │  │
│  │  <router-outlet>  │  │     │  └───────────────────┘  │
│  │  ┌─────────────┐  │  │     └─────────────────────────┘
│  │  │ Home        │  │  │
│  │  └─────────────┘  │  │     A tela de login NÃO tem
│  └───────────────────┘  │     a navbar, pois é uma rota
└─────────────────────────┘     separada.
```

> 📌 Repare que o `CineifNavbar` tem **o seu próprio** `<router-outlet />` (no final do `cineif-navbar.html`). Assim, a navbar fica fixa e só o conteúdo abaixo dela (a `Home`) é trocado.

---

# 🧭 Etapa 1 — Desenvolvendo a NavBar (Barra de Navegação)

**Conceitos:** Diretiva Condicional IF (`@if`) · Interpolação (*Interpolation*) · Evento de Clique (*Click Event*)

## 1.1 Conhecendo o componente `CineifNavbar` (TypeScript)

Abra `src/app/modules/layout/cineif-navbar/cineif-navbar.ts`.

```ts
export class CineifNavbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userLogado: Usuario | null = null;

  ngOnInit(): void {
    this.authService.login('aluno@if.edu.br', '123');
    this.userLogado = this.authService.getUsuarioLogado();
    console.log(this.userLogado);
  }

  redirecionarPaginaDestino(destination: string) {
    this.router.navigate([destination]);
  }

  logout() {
    this.authService.logout();
  }
}
```

Vamos entender cada parte:

**a) `inject(...)` — Injeção de Dependência (*Dependency Injection*).** Em vez de criarmos o `AuthService` na mão (`new AuthService()`), pedimos ao Angular: *"me entregue o serviço pronto"*. O mesmo vale para o `Router`, que é a ferramenta que troca de página. (Em projetos antigos isso era feito no `constructor(private authService: AuthService)`.)

**b) `userLogado: Usuario | null`.** Variável que guarda o usuário logado, ou `null` se não houver ninguém logado.

**c) `implements OnInit` e `ngOnInit()` — Ciclo de Vida (*Lifecycle Hook*).** O Angular cria e destrói componentes o tempo todo. `OnInit` é uma "promessa" (interface) de que a classe terá a função **`ngOnInit`**, que o Angular **chama automaticamente, uma única vez, logo que o componente é iniciado**. É o lugar ideal para buscar dados iniciais.

Dentro do `ngOnInit` temos duas coisas:

1. `this.authService.login('aluno@if.edu.br', '123')` → **simula o login** de um usuário (só para testarmos a navbar enquanto não existe a tela de login).
2. `this.userLogado = this.authService.getUsuarioLogado()` → **recupera** o usuário que está logado.

**d) `redirecionarPaginaDestino(destination)`** → recebe o endereço de destino (ex.: `'/login'`) e leva o usuário até lá usando o `Router`.

**e) `logout()`** → pede ao `AuthService` para deslogar o usuário.

### 🧪 Experimento: usuário logado × deslogado

Para testar as duas situações, altere o `ngOnInit`:

```ts
ngOnInit(): void {
  // ▶ CENÁRIO 1 — USUÁRIO LOGADO (deixe esta linha ativa)
  this.authService.login('aluno@if.edu.br', '123');

  // ▶ CENÁRIO 2 — USUÁRIO DESLOGADO (comente a linha de cima e ative esta)
  // this.authService.logout();

  this.userLogado = this.authService.getUsuarioLogado();
  console.log(this.userLogado);
}
```

Salve e olhe o **Console** (`F12`): no cenário 1 aparece um objeto com o usuário; no cenário 2 aparece `null`.

> ⚠️ **Por que não basta comentar o `login`?** O `AuthService` guarda o usuário logado no *Local Storage* do navegador, que **permanece mesmo depois de recarregar a página**. Se você só comentar o `login`, o usuário continua logado da execução anterior. Por isso, para simular o "deslogado", chamamos o `logout()`.

**Deixe o Cenário 1 (logado) ativo** para continuar.

## 1.2 Conhecendo o HTML da navbar

Abra `cineif-navbar.html`. Ele tem:

- Um `<nav>` verde do Bootstrap com a **imagem** (logo do Cineif), que já tem um evento de clique para voltar à página inicial;
- **Uma `<div>` para o usuário logado** (ícone de pessoa + "Olá, Nome do Usuário" + botão de sair) — está **comentada** (entre `<!--` e `-->`);
- **Uma `<div>` para o usuário deslogado** (botões *Login* e *Cadastrar-se*);
- O `<router-outlet />` no final, onde a `Home` é exibida.

Hoje, só a área do usuário deslogado aparece. Vamos fazer o HTML **decidir sozinho** qual área mostrar.

---

## 1.3 🛠️ Mão na Massa: Diretiva Condicional IF (Conditional Directive `@if`)

### Para que serve?

Uma **diretiva condicional** mostra ou esconde um pedaço do HTML **conforme uma condição**. É o `if` do TypeScript, mas escrito dentro do HTML.

### A forma nova (Angular 17+): bloco `@if`

```html
@if (condicao) {
  <!-- HTML mostrado quando a condição é verdadeira -->
} @else {
  <!-- HTML mostrado quando a condição é falsa -->
}
```

### Como era feito antes: `*ngIf`

```html
<!-- ANTES (Angular 16 ou anterior) -->
<div *ngIf="condicao; else outroBloco"> ... </div>
<ng-template #outroBloco> ... </ng-template>
```

O `*ngIf` exigia **importar `NgIf`** (ou `CommonModule`) e usar o `<ng-template>` para o "senão". O `@if` é **nativo**: não precisa importar nada e é bem mais legível.

### Passo a passo

**Passo 1.** Em `cineif-navbar.html`, **descomente** a área do usuário logado (apague o `<!--` e o `-->`). Salve e veja: as duas áreas aparecem juntas. Não faz sentido!

**Passo 2.** Envolva as duas áreas com `@if` / `@else`. Se **existir** usuário logado (`userLogado` diferente de `null`), mostramos a área do usuário; **caso contrário**, a área de login:

```html
<nav ...>
  <div class="container-xxl">
    <a class="navbar-brand text-white" (click)="redirecionarPaginaDestino('/')">
      <img src="assets/logo-cineif-white.png" class="rounded" style="height: 60px" />
    </a>

    @if (userLogado) {
      <!-- Área do usuário logado -->
      <div class="d-flex align-items-center">
        ... (conteúdo que você descomentou) ...
      </div>
    } @else {
      <!-- Área do usuário não logado -->
      <div class="d-flex align-items-center">
        ... (botões Login e Cadastrar-se) ...
      </div>
    }
  </div>
</nav>
```

> 💡 O `@if (userLogado)` considera `null` como "falso" e um objeto como "verdadeiro". Se preferir escrever a condição "ao contrário", também funciona: `@if (!userLogado) { ...área deslogada... }`.

**Passo 3. Teste os dois cenários** alternando as linhas do `ngOnInit` (Experimento da seção 1.1):

| Cenário | O que deve aparecer |
|---|---|
| Logado (`login(...)` ativo) | Ícone de pessoa, "Olá, Nome do Usuário" e botão de sair |
| Deslogado (`logout()` ativo) | Botões **Login** e **Cadastrar-se** |

Quando terminar, **volte ao Cenário 1 (logado)**.

---

## 1.4 🛠️ Mão na Massa: Interpolação / Vinculação de Dados Unidirecional (Interpolation / One-Way Data Binding)

Na área do usuário logado, está escrito um texto fixo: `Olá, Nome do Usuário`. Queremos mostrar o **nome real** do usuário logado, que está dentro da variável `userLogado` do TypeScript.

A **interpolação** usa **chaves duplas `{{ }}`** para colocar, dentro do HTML, o valor de uma variável da classe. Chamamos de **unidirecional** (*one-way*) porque os dados fluem em **uma única direção**: **do TypeScript → para o HTML**.

```text
  TypeScript (classe)                 HTML (template)
  userLogado.nome  ───────────────▶   {{ userLogado.nome }}
```

Troque o texto fixo:

```html
<span class="text-white fw-bold" style="margin-left: 20px; font-size: 20px">Olá, {{ userLogado.nome }}</span>
```

Salve. A navbar deve mostrar **"Olá, Usuário Teste IFTM"**.

> 💡 Dentro do bloco `@if (userLogado)`, o Angular sabe que `userLogado` não é `null`, então podemos escrever `userLogado.nome` direto. Fora de um `@if`, usaríamos o operador de navegação segura `userLogado?.nome` ("se `userLogado` existir, pegue o nome").

---

## 1.5 🛠️ Mão na Massa: Evento de Clique (Click Event)

### O que é?

Um **evento** é algo que acontece na tela (um clique, uma tecla digitada...). Com o **Event Binding** (*vinculação de evento*), dizemos ao Angular: *"quando X acontecer neste elemento, execute esta função do TypeScript"*. A sintaxe usa **parênteses**:

```html
<button (click)="nomeDaFuncao()">Clique aqui</button>
```

> 🧠 **Para não confundir:** `(evento)="funcao()"` → o HTML **avisa** o TypeScript (HTML → TS). Já `{{ variavel }}` → o TypeScript **informa** o HTML (TS → HTML).

Você já tem um exemplo pronto: o **logo** da navbar possui `(click)="redirecionarPaginaDestino('/')"`, que leva o usuário para a página inicial.

### Parte A — Botão **Login**: ir para a tela de login

No botão **Login** (na área do usuário deslogado), adicione o evento de clique chamando a função de redirecionamento, passando o endereço **`'/login'`**:

```html
<button type="button" class="btn btn-light" (click)="redirecionarPaginaDestino('/login')">
  <span class=" fw-bold" style="font-size: 20px; color: #43964c">Login</span>
</button>
```

> 📝 Se o seu botão já estiver com esse `(click)`, **apague e escreva novamente** para praticar!

**Para testar**, ative o **Cenário 2 (deslogado)** no `ngOnInit`, clique em **Login** e veja a tela de login aparecer.

**O que aconteceu?** A função chamou `this.router.navigate(['/login'])`. O endereço do navegador mudou para `/login` e o roteador procurou essa rota no `app.routes.ts`. Ao encontrar `path: 'login'`, o Angular **trocou o componente `Home` (com a navbar) pelo componente `Login`** dentro do `<router-outlet />` do `App`. A página **não recarregou**: só os componentes foram trocados.

### Parte B — Botão **Sair**: logout

No botão de sair (ícone `bi-box-arrow-right`, na área do usuário logado), adicione o evento de clique chamando a função **`logout()`**:

```html
<button type="button" class="btn btn-light" style="margin-left: 20px;" (click)="logout()">
  <i class="bi bi-box-arrow-right" style="font-size: 20px; color: #43964c"></i>
</button>
```

Volte ao **Cenário 1 (logado)** e **clique no botão de sair**.

🤔 **O que aconteceu na tela?** Nada! Mas abra `F12 → Application → Local Storage`: a chave `cineif_usuario_logado` **foi apagada**. O `AuthService` fez o seu trabalho, só que a nossa variável **`userLogado` do componente continua com o valor antigo**, e o `@if` só reage a mudanças nessa variável.

**Correção:** precisamos "zerar" a variável também. Altere a função `logout()` no `cineif-navbar.ts`:

```ts
logout() {
  this.authService.logout();
  this.userLogado = null;   // ← o @if percebe a mudança e troca a área da tela
}
```

Teste novamente: ao clicar em sair, a navbar muda **imediatamente** para a área de deslogado.

## 1.6 ✅ Conferência da Etapa 1

Deixe o `ngOnInit` no **Cenário 1 (logado)**. Veja se o seu código confere:

<details>
<summary>📄 <code>cineif-navbar.ts</code> (clique para ver)</summary>

```ts
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
    this.authService.login('aluno@if.edu.br', '123');   // atalho de teste (será removido na Etapa 2)
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
```
</details>

<details>
<summary>📄 <code>cineif-navbar.html</code> (clique para ver)</summary>

```html
<nav class="navbar bg-body-tertiary" style="background-color: #43964c !important" data-bs-theme="light">
  <div class="container-xxl">
    <a class="navbar-brand text-white" (click)="redirecionarPaginaDestino('/')">
      <img src="assets/logo-cineif-white.png" class="rounded" style="height: 60px" />
    </a>

    @if (userLogado) {
      <!-- Área do usuário logado -->
      <div class="d-flex align-items-center">
        <i class="bi bi-person-circle text-white" style="font-size: 40px"></i>
        <span class="text-white fw-bold" style="margin-left: 20px; font-size: 20px">Olá, {{ userLogado.nome }}</span>
        <button type="button" class="btn btn-light" style="margin-left: 20px;" (click)="logout()">
          <i class="bi bi-box-arrow-right" style="font-size: 20px; color: #43964c"></i>
        </button>
      </div>
    } @else {
      <!-- Área do usuário não logado -->
      <div class="d-flex align-items-center">
        <button type="button" class="btn btn-light" (click)="redirecionarPaginaDestino('/login')">
          <span class=" fw-bold" style="font-size: 20px; color: #43964c">Login</span>
        </button>
        <button type="button" class="btn btn-light" style="margin-left: 20px;">
          <span class=" fw-bold" style="font-size: 20px; color: #43964c">Cadastrar-se</span>
        </button>
      </div>
    }
  </div>
</nav>

<router-outlet />
```
</details>

**Checklist:**
- [ ] Logado: aparece "Olá, Usuário Teste IFTM" e o botão de sair
- [ ] Clicar em sair troca imediatamente para os botões Login/Cadastrar-se
- [ ] Deslogado: o botão **Login** abre a tela de login
- [ ] O logo volta para a página inicial

> ⚠️ **Aviso:** a linha `this.authService.login('aluno@if.edu.br', '123')` é só um **atalho de teste**. Ela faz login automaticamente toda vez que a navbar é criada. Vamos **removê-la na Etapa 2**, quando o login de verdade existir.

---

# 🔐 Etapa 2 — Desenvolvendo a Tela de Login

**Conceitos:** Formulário Orientado a Template (*Template-Driven Form*) · Vinculação de Dados Bidirecional (*Two-Way Data Binding*) · Injeção de Dependência · Roteamento

## 2.1 Duas formas de criar formulários no Angular

O Angular oferece **duas abordagens**. Vamos usar as duas neste exercício:

| | **Orientado a Template** (*Template-Driven*) | **Reativo** (*Reactive Forms*) |
|---|---|---|
| Onde fica o controle do formulário | No **HTML** | No **TypeScript** |
| Principais recursos | Diretiva `[(ngModel)]` | `FormGroup`, `FormControl`, `Validators` |
| Módulo a importar | `FormsModule` | `ReactiveFormsModule` |
| Validações | Atributos no HTML (`required`, `minlength`...) | Funções (`Validators`) na classe |
| Quantidade de código | Pouco | Mais, porém organizado |
| Testes e reuso | Mais difícil | Mais fácil |
| **Quando usar** | Formulários **simples**, com poucos campos e poucas regras (login, busca, filtro) | Formulários **grandes ou complexos**: muitas validações, campos que dependem de outros, validações personalizadas (cadastro) |

👉 **Login** (2 campos, regra simples) → **Template-Driven**, nesta etapa.
👉 **Cadastro** (5 campos, várias validações) → **Reactive Form**, na Etapa 3.

## 2.2 Conhecendo a tela de login

O componente fica em `src/app/modules/pages/login/` (`login.ts`, `login.html`, `login.scss`) e a rota `/login` já está cadastrada no `app.routes.ts`.

Abra o `login.html`. Já existem os campos **E-mail** e **Senha**, a mensagem *"Se ainda não possui um perfil, cadastre-se!"* e o botão **Realizar Login**. Falta a "inteligência" no TypeScript.

O `login.ts` do projeto base tem uma função `redirectCadastro()` que nós vamos **reescrever em uma versão mais genérica**, igual à da navbar.

---

## 2.3 🛠️ Mão na Massa: Vinculação de Dados Bidirecional (Two-Way Data Binding)

### Passo 1 — Criar as variáveis no TypeScript

No `login.ts`, dentro da classe, crie as variáveis que vão guardar o que o usuário digitar:

```ts
export class Login {
  private router = inject(Router);

  email = '';
  senha = '';
  ...
}
```

### Passo 2 — Importar o `FormsModule`

O `[(ngModel)]` pertence ao `FormsModule`. Lembre-se: **tudo que o HTML usa precisa estar no `imports` do componente**. Ainda no `login.ts`:

```ts
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],        // ← substitua o RouterModule por FormsModule
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
```

> Podemos retirar o `RouterModule` porque vamos navegar pelo `Router` dentro do TypeScript, e não mais pelo `routerLink` do HTML (veremos na seção 2.4). Ajuste também o import do topo do arquivo para `import { Router } from '@angular/router';`.

### Passo 3 — Ligar o input à variável com `[(ngModel)]`

No `login.html`, adicione `[(ngModel)]` em cada `<input>`:

```html
<input type="text" class="form-control" placeholder="Digite aqui o seu e-mail..."
       [(ngModel)]="email" />
```

E faça o **mesmo para o campo da senha**, ligando à variável `senha`:

```html
<input type="password" class="form-control" placeholder="***************"
       [(ngModel)]="senha" />
```

> 📝 Como os inputs não estão dentro de uma tag `<form>`, não precisamos do atributo `name`.

### O que está acontecendo?

A sintaxe **`[( )]`** é conhecida como **"banana na caixa"** (*banana in a box*) 🍌📦: são os **parênteses** (eventos) dentro dos **colchetes** (valores). Ela une as duas direções:

```text
  TypeScript                               HTML (input)
  email ─────── [ngModel] ───────────────▶ mostra o valor no campo
  email ◀────── (ngModelChange) ────────── a cada tecla digitada
```

- **TS → HTML:** se a variável tem um valor, o campo o exibe.
- **HTML → TS:** quando o usuário digita, o Angular **atualiza a variável automaticamente**.

Como os dados trafegam **nos dois sentidos**, chamamos de **Two-Way Data Binding** (vinculação de dados bidirecional). Compare com a interpolação `{{ }}` da Etapa 1, que era *one-way*.

### 🧪 Veja funcionando

1. **Temporariamente**, logo abaixo do input de e-mail, adicione: `<p>Você digitou: {{ email }}</p>`. Digite no campo e veja o texto mudar em tempo real (HTML → TS → HTML).
2. Mude no TypeScript para `email = 'teste@teste.com'`. Ao recarregar, o campo já vem preenchido (TS → HTML).
3. **Apague** o `<p>` e volte o `email` para `''` antes de continuar.

---

## 2.4 🛠️ Mão na Massa: Navegação com o `Router` (Roteamento / Routing)

O texto *"Se ainda não possui um perfil, **cadastre-se!**"* é um link para a tela de cadastro. Vamos reescrever a navegação seguindo o padrão que vimos na navbar.

### Passo 1 — A função de redirecionamento

No `login.ts`, o `Router` já está injetado (`private router = inject(Router)`). Substitua a função `redirectCadastro()` por uma função **genérica**, que recebe o destino como parâmetro (`destination`):

```ts
redirecionarPaginaDestino(destination: string) {
  this.router.navigate([destination]);
}
```

### Passo 2 — Usar no HTML

No `login.html`, o link "cadastre-se!" tem um `routerLink` e um `(click)` antigo. Deixe apenas o evento de clique com a nova função, apontando para **`/cadastro`**:

```html
<span class="mt-5">Se ainda não possui um perfil,
  <a style="cursor: pointer" (click)="redirecionarPaginaDestino('/cadastro')">cadastre-se!</a>
</span>
```

> ⚠️ **Atenção:** a rota `/cadastro` **ainda não foi cadastrada**. Se clicar agora, aparecerá um erro no Console. **Não se preocupe!** Vamos criá-la na Etapa 3.

> 💡 `routerLink="/cadastro"` é outra forma de navegar, direto no HTML. Se usássemos os dois (`routerLink` e `(click)`), a navegação aconteceria duas vezes. Por isso mantemos só um.

---

## 2.5 🛠️ Mão na Massa: Fazendo o Login Funcionar

### Passo 1 — Injetar o `AuthService`

O `AuthService` (em `modules/services/authservice.ts`) já sabe verificar e-mail e senha. Vamos pedir uma instância dele ao Angular com `inject`, **igual fizemos com o Router**:

```ts
import { AuthService } from '../../services/authservice';

export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  ...
}
```

### Passo 2 — A função `login()`

O método `authService.login(email, senha)` **retorna o usuário** (se e-mail e senha estiverem corretos) ou **`null`** (se estiverem errados). Crie também uma variável `erroLogin` para controlar a mensagem de erro:

```ts
erroLogin = false;

login() {
  const usuario = this.authService.login(this.email, this.senha);

  if (usuario) {
    // deu certo: vai para a Home
    this.erroLogin = false;
    this.redirecionarPaginaDestino('/');
  } else {
    // deu errado: ativa a mensagem de erro
    this.erroLogin = true;
  }
}
```

### Passo 3 — Mensagem de erro com o alerta do Bootstrap

No `login.html`, **troque** o `<span>` "Colocar mensagem de erro aqui se houver" por um alerta do Bootstrap (`alert alert-danger`), que só aparece quando `erroLogin` for verdadeiro. Aqui reaproveitamos o **`@if`** da Etapa 1:

```html
@if (erroLogin) {
  <div class="alert alert-danger mx-5 mt-3 py-2" role="alert">
    Usuário e/ou senha incorretos!
  </div>
}
```

> 💡 Se a caixa cinza ficar apertada com o alerta aparecendo, no `login.scss` troque `height: 550px;` por `min-height: 550px;` na classe `.form-div`, assim ela cresce conforme o conteúdo.

### Passo 4 — Ligar o botão com o Evento de Clique

No botão **Realizar Login**, use o evento de clique que você aprendeu na Etapa 1:

```html
<button class="btn btn-success mx-5" (click)="login()">Realizar Login</button>
```

### Passo 5 — Remover o login automático da navbar

Volte ao `cineif-navbar.ts` e **apague (ou comente) a linha de atalho** do `ngOnInit`, pois agora existe um login de verdade:

```ts
ngOnInit(): void {
  // this.authService.login('aluno@if.edu.br', '123');   ← REMOVIDA
  this.userLogado = this.authService.getUsuarioLogado();
}
```

(O `console.log` também pode sair.) Se você deixasse o login automático, **toda vez** que a Home carregasse o usuário de teste seria logado por cima de quem acabou de entrar!

## 2.6 ✅ Conferência e Testes da Etapa 2

<details>
<summary>📄 <code>login.ts</code> (clique para ver)</summary>

```ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

  email = '';
  senha = '';
  erroLogin = false;

  redirecionarPaginaDestino(destination: string) {
    this.router.navigate([destination]);
  }

  login() {
    const usuario = this.authService.login(this.email, this.senha);

    if (usuario) {
      this.erroLogin = false;
      this.redirecionarPaginaDestino('/');
    } else {
      this.erroLogin = true;
    }
  }
}
```
</details>

<details>
<summary>📄 <code>login.html</code> (clique para ver)</summary>

```html
<div class="page-background">
  <div class="form-div">
    <div class="d-flex flex-column text-center">

      <div class="mt-3">
        <img src="assets/logo-cineif.png" alt="logo" style="height: 80px; border-radius: 20px;" />
      </div>
      <span class="green-text" style="padding-top: 15px; font-size: 25px;">
        Realize o Login para continuar...
      </span>

      <!-- Form -->
      <div class="mx-5 mt-5 text-start">
        <span class="form-label input-span">E-mail:</span>
        <input type="text" class="form-control" placeholder="Digite aqui o seu e-mail..." [(ngModel)]="email" />
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">Senha:</span>
        <input type="password" class="form-control" placeholder="***************" [(ngModel)]="senha" />
      </div>

      @if (erroLogin) {
        <div class="alert alert-danger mx-5 mt-3 py-2" role="alert">Usuário e/ou senha incorretos!</div>
      }

      <span class="mt-5">Se ainda não possui um perfil,
        <a style="cursor: pointer" (click)="redirecionarPaginaDestino('/cadastro')">cadastre-se!</a>
      </span>
      <button class="btn btn-success mx-5" (click)="login()">Realizar Login</button>
    </div>
  </div>
</div>
```
</details>

**Realize os testes** (comece clicando em sair na navbar, se estiver logado):

| # | Teste | Resultado esperado |
|---|---|---|
| 1 | Home deslogada → botão **Login** | Abre a tela de login |
| 2 | Login com `aluno@if.edu.br` / `123` | Vai para a Home e mostra "Olá, Usuário Teste IFTM" |
| 3 | Sair e logar com senha errada | Aparece o alerta vermelho **"Usuário e/ou senha incorretos!"** |
| 4 | Logar com e-mail inexistente | O mesmo alerta |
| 5 | Corrigir a senha e logar | O alerta some e entra na Home |
| 6 | Recarregar a página (`F5`) logado | Continua logado (dados no Local Storage) |
| 7 | Clicar em "cadastre-se!" | Erro no Console (a rota ainda não existe) ✔ esperado |

---

# 📝 Etapa 3 — Desenvolvendo a Página de Cadastro

**Conceitos:** Formulário Reativo (*Reactive Form*) · `FormGroup` e `FormControl` · Validadores (*Validators*) · Mensagens de erro condicionais

## 3.1 Ajuste no modelo de dados

Nosso cadastro terá o campo **CPF**, mas a interface `Usuario` (no início do `authservice.ts`) ainda não o conhece. Adicione a propriedade `cpf`:

```ts
export interface Usuario {
  nome?: string;
  email?: string;
  cpf?: string;        // ← novo
  telefone?: string;
  senha?: string;
}
```

## 3.2 Criando o componente e registrando a rota

### Gerar o componente com o Angular CLI

No terminal, na raiz do projeto (pode abrir um segundo terminal, mantendo o `npm start` rodando):

```bash
ng generate component modules/pages/register --skip-tests
```

(Forma curta: `ng g c modules/pages/register --skip-tests`)

O CLI cria a pasta `src/app/modules/pages/register/` com `register.ts`, `register.html` e `register.scss`. A opção `--skip-tests` evita o arquivo `.spec.ts`. Se ele aparecer, pode excluí-lo.

### Registrar a rota `/cadastro`

No `app.routes.ts`, importe o componente e acrescente a rota (lembra do "não se preocupe" da Etapa 2? Chegou a hora):

```ts
import { Register } from './modules/pages/register/register';

export const routes: Routes = [
  {
    path: '',
    component: CineifNavbar,
    children: [{ path: '', component: Home }],
  },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Register },   // ← nova rota
];
```

### Testar

Acesse `http://localhost:4200/cadastro`: deve aparecer **"register works!"**. Na tela de login, o link **"cadastre-se!"** agora funciona.

### Ligar o botão "Cadastrar-se" da navbar

Na área do usuário deslogado da navbar, o botão **Cadastrar-se** ainda não faz nada. Adicione o evento de clique:

```html
<button type="button" class="btn btn-light" style="margin-left: 20px;"
        (click)="redirecionarPaginaDestino('/cadastro')">
```

## 3.3 Montando o visual (copiando da tela de login)

A tela de cadastro é visualmente parecida com a de login. Vamos **reaproveitar**.

### HTML

1. Abra `login.html`, **copie todo o conteúdo** e **cole** no `register.html` (substituindo o `register works!`).
2. **Retire** o que é específico do login:
   - todos os `[(ngModel)]`;
   - o `(click)="login()"` do botão;
   - o bloco `@if (erroLogin) { ... }` (criaremos outro depois);
   - o texto *"Se ainda não possui um perfil, cadastre-se!"* e o seu link.
3. Troque o texto do topo para **"Crie o seu perfil..."**.
4. **Aumente a quantidade de inputs**, copiando o bloco de um campo (`<div class="mx-5 mt-2 text-start">...</div>`), para ficarem **5 campos**: Nome completo, CPF, E-mail, Senha e Confirmar senha.
5. Troque o texto do botão para **Cadastrar**.

O esqueleto fica assim (ainda sem nenhuma lógica):

```html
<div class="page-background">
  <div class="form-div">
    <div class="d-flex flex-column text-center">

      <div class="mt-3">
        <img src="assets/logo-cineif.png" alt="logo" style="height: 80px; border-radius: 20px;" />
      </div>
      <span class="green-text" style="padding-top: 15px; font-size: 25px;">
        Crie o seu perfil...
      </span>

      <!-- Form -->
      <div class="mx-5 mt-4 text-start">
        <span class="form-label input-span">Nome completo:</span>
        <input type="text" class="form-control" placeholder="Digite aqui o seu nome completo..." />
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">CPF:</span>
        <input type="text" class="form-control" placeholder="Somente números (11 dígitos)" />
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">E-mail:</span>
        <input type="text" class="form-control" placeholder="Digite aqui o seu e-mail..." />
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">Senha:</span>
        <input type="password" class="form-control" placeholder="***************" />
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">Confirmar senha:</span>
        <input type="password" class="form-control" placeholder="***************" />
      </div>

      <button type="button" class="btn btn-success mx-5 mt-4">Cadastrar</button>
    </div>
  </div>
</div>
```

### CSS — por que copiar também?

Copie o conteúdo de `login.scss` para `register.scss`. Isso é necessário porque **o estilo de um componente vale somente para ele** (isolamento de estilos, ou *view encapsulation*). As classes `.page-background`, `.form-div`, `.green-text` e `.input-span` existem apenas no CSS do login!

Com 5 campos, a caixa cinza não cabe mais nos 550px de altura. Ajuste o `register.scss` para ela **crescer conforme o conteúdo**:

```scss
.page-background {
    background-color: #43964c;
    min-height: 100vh;          /* era: height */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0;            /* novo: respiro em telas baixas */
}

.form-div {
    background-color: #eeeeee;
    width: 550px;
    min-height: 550px;          /* era: height: 550px */
    padding-bottom: 30px;       /* novo */
    border-radius: 30px;
}
/* .green-text e .input-span continuam iguais */
```

Confira no navegador (`/cadastro`) se o visual está bom antes de seguir.

---

## 3.4 🛠️ Mão na Massa: Formulário Reativo (Reactive Form)

### Ideia geral

No formulário reativo, **o formulário é um objeto do TypeScript**:

- **`FormControl`** = *um campo* (guarda o valor + se é válido + se foi tocado...);
- **`FormGroup`** = *um grupo de campos* (o formulário inteiro).

O HTML apenas se **conecta** a esse objeto:

```text
  TypeScript                                HTML
  formCadastro (FormGroup)  ──────────────▶ [formGroup]="formCadastro"
     ├─ nome   (FormControl) ─────────────▶ formControlName="nome"
     ├─ cpf    (FormControl) ─────────────▶ formControlName="cpf"
     └─ ...
```

### Passo 1 — Importar o `ReactiveFormsModule`

No `register.ts` (diferente do login, aqui o módulo é outro):

```ts
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
```

### Passo 2 — Criar o `FormGroup` com os Validadores

**Validadores** (*Validators*) são regras que dizem se o valor de um campo é válido. Cada campo recebe uma lista deles:

| Campo | Validadores | Regra |
|---|---|---|
| `nome` | `Validators.required`, `Validators.minLength(3)` | Obrigatório, mínimo 3 letras |
| `cpf` | `Validators.required`, `Validators.pattern(/^\d{11}$/)` | Obrigatório, exatamente 11 números |
| `email` | `Validators.required`, `Validators.email` | Obrigatório, formato de e-mail |
| `senha` | `Validators.required`, `Validators.minLength(6)` | Obrigatória, mínimo 6 caracteres |
| `confirmarSenha` | `Validators.required` | Obrigatória (+ regra do grupo, abaixo) |

Para criar o grupo usaremos o `NonNullableFormBuilder`, um **atalho** que cria `FormGroup` e `FormControl`s para nós (e garante que os valores sejam sempre `string`, nunca `null`). Cada campo é escrito como `nomeDoCampo: [valorInicial, [validadores]]`:

```ts
import { inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

export class Register {
  private fb = inject(NonNullableFormBuilder);

  formCadastro = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]],
  });
}
```

> 📚 Sem o atalho, o equivalente seria `new FormGroup({ nome: new FormControl('', [Validators.required, ...]), ... })`. O resultado é o mesmo, só mais longo.

### Passo 3 — Validador do grupo: "as senhas conferem?"

Nenhum validador pronto compara **dois campos**. Então criamos um **validador personalizado** que olha para o **grupo inteiro**. Ele retorna `null` quando está tudo certo, ou um objeto com o nome do erro quando está errado. Escreva-o **acima** do `@Component` (fora da classe):

```ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const senhasIguais: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const senha = grupo.get('senha')?.value;
  const confirmarSenha = grupo.get('confirmarSenha')?.value;
  return senha === confirmarSenha ? null : { senhasDiferentes: true };
};
```

E aplique-o como **segundo argumento** do `group` (as chaves `{ validators: ... }`):

```ts
formCadastro = this.fb.group(
  {
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]],
  },
  { validators: senhasIguais },
);
```

### Passo 4 — Atalhos (getters) para o HTML

Para o HTML ficar limpo, criamos pequenos "atalhos" que devolvem cada campo:

```ts
get nome() { return this.formCadastro.controls.nome; }
get cpf() { return this.formCadastro.controls.cpf; }
get email() { return this.formCadastro.controls.email; }
get senha() { return this.formCadastro.controls.senha; }
get confirmarSenha() { return this.formCadastro.controls.confirmarSenha; }
```

### Passo 5 — Conectar o HTML ao formulário

No `register.html`:

**a)** Na `<div>` que envolve os campos (`<div class="d-flex flex-column text-center">`), adicione `[formGroup]`:

```html
<div class="d-flex flex-column text-center" [formGroup]="formCadastro">
```

> 💡 Em formulários reativos o `[formGroup]` costuma ficar numa tag `<form>`, mas funciona em qualquer elemento que envolva os campos. Usamos a `<div>` já existente para não mudar o layout.

**b)** Em cada `<input>`, adicione **`formControlName`** com o **mesmo nome** do campo no `FormGroup`: `"nome"`, `"cpf"`, `"email"`, `"senha"` e `"confirmarSenha"`.

### Passo 6 — Mensagens de erro

Para cada campo, mostramos um texto vermelho **somente se** o campo estiver inválido **e** o usuário já tiver mexido nele (`touched`, "tocado"). Se não checássemos o `touched`, a tela já nasceria cheia de erros! Veja o exemplo do campo **nome** (usa o `@if` que você já domina):

```html
<div class="mx-5 mt-4 text-start">
  <span class="form-label input-span">Nome completo:</span>
  <input type="text" class="form-control" placeholder="Digite aqui o seu nome completo..."
         formControlName="nome" />

  @if (nome.invalid && nome.touched) {
    <small class="text-danger">
      @if (nome.hasError('required')) {
        O nome é obrigatório.
      } @else if (nome.hasError('minlength')) {
        O nome deve ter pelo menos 3 letras.
      }
    </small>
  }
</div>
```

O método `hasError('...')` pergunta se o campo falhou em um validador específico. **Os nomes dos erros** de cada validador são:

| Validador | Nome do erro em `hasError()` |
|---|---|
| `Validators.required` | `'required'` |
| `Validators.minLength(n)` | `'minlength'` |
| `Validators.pattern(...)` | `'pattern'` |
| `Validators.email` | `'email'` |
| Nosso `senhasIguais` | `'senhasDiferentes'` (no **grupo**, não no campo) |

**Faça o mesmo para `cpf`, `email` e `senha`**, com estas mensagens sugeridas:

| Campo | `required` | Outro erro |
|---|---|---|
| `cpf` | O CPF é obrigatório. | `pattern`: O CPF deve conter exatamente 11 números. |
| `email` | O e-mail é obrigatório. | `email`: Digite um e-mail válido. |
| `senha` | A senha é obrigatória. | `minlength`: A senha deve ter pelo menos 6 caracteres. |

Para **confirmar a senha**, o erro `senhasDiferentes` pertence ao **grupo** (`formCadastro`), não ao campo:

```html
@if (confirmarSenha.touched) {
  <small class="text-danger">
    @if (confirmarSenha.hasError('required')) {
      Confirme a sua senha.
    } @else if (formCadastro.hasError('senhasDiferentes')) {
      As senhas não conferem.
    }
  </small>
}
```

## 3.5 🛠️ Mão na Massa: Função `cadastrar()` e botão

### No TypeScript

Injete o `AuthService` e o `Router`, e crie a função de redirecionamento (como no login) e a função `cadastrar()`:

```ts
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
```

`markAllAsTouched()` marca todos os campos como "tocados", e assim as mensagens de erro de todos aparecem de uma vez. O `authService.cadastrar(...)` devolve **`true`** se cadastrou e **`false`** se o e-mail já existia. Quando for `true`, pedimos o login ao `authService` e depois redirecionamos para a Home.

> 🔒 **Curiosidade:** guardar senha em texto puro no navegador é **só para fins didáticos**. Em sistemas reais, a senha é enviada a um servidor e armazenada com *hash*.

### No HTML

Antes do botão, adicione o alerta (igual ao do login) e ligue o botão ao evento de clique:

```html
@if (erroCadastro) {
  <div class="alert alert-danger mx-5 mt-3 py-2" role="alert">{{ erroCadastro }}</div>
}

<button type="button" class="btn btn-success mx-5 mt-4" (click)="cadastrar()">Cadastrar</button>
```

Veja que o alerta usa **interpolação** (`{{ erroCadastro }}`), pois a mensagem vem do TypeScript.

## 3.6 ✅ Conferência e Testes da Etapa 3

<details>
<summary>📄 <code>register.ts</code> (clique para ver)</summary>

```ts
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authservice';

// Validador do GRUPO: compara dois campos
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
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);

  erroCadastro = '';

  formCadastro = this.fb.group(
    {
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    },
    { validators: senhasIguais },
  );

  get nome() { return this.formCadastro.controls.nome; }
  get cpf() { return this.formCadastro.controls.cpf; }
  get email() { return this.formCadastro.controls.email; }
  get senha() { return this.formCadastro.controls.senha; }
  get confirmarSenha() { return this.formCadastro.controls.confirmarSenha; }

  redirecionarPaginaDestino(destination: string) {
    this.router.navigate([destination]);
  }

  cadastrar() {
    if (this.formCadastro.invalid) {
      this.formCadastro.markAllAsTouched();
      return;
    }

    const { nome, cpf, email, senha } = this.formCadastro.getRawValue();
    const cadastrou = this.authService.cadastrar({ nome, cpf, email, senha });

    if (cadastrou) {
      this.authService.login(email, senha);
      this.redirecionarPaginaDestino('/');
    } else {
      this.erroCadastro = 'Já existe um usuário cadastrado com este e-mail.';
    }
  }
}
```
</details>

<details>
<summary>📄 <code>register.html</code> (clique para ver)</summary>

```html
<div class="page-background">
  <div class="form-div">
    <div class="d-flex flex-column text-center" [formGroup]="formCadastro">

      <div class="mt-3">
        <img src="assets/logo-cineif.png" alt="logo" style="height: 80px; border-radius: 20px;" />
      </div>
      <span class="green-text" style="padding-top: 15px; font-size: 25px;">
        Crie o seu perfil...
      </span>

      <!-- Form -->
      <div class="mx-5 mt-4 text-start">
        <span class="form-label input-span">Nome completo:</span>
        <input type="text" class="form-control" placeholder="Digite aqui o seu nome completo..." formControlName="nome" />
        @if (nome.invalid && nome.touched) {
          <small class="text-danger">
            @if (nome.hasError('required')) {
              O nome é obrigatório.
            } @else if (nome.hasError('minlength')) {
              O nome deve ter pelo menos 3 letras.
            }
          </small>
        }
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">CPF:</span>
        <input type="text" class="form-control" placeholder="Somente números (11 dígitos)" formControlName="cpf" />
        @if (cpf.invalid && cpf.touched) {
          <small class="text-danger">
            @if (cpf.hasError('required')) {
              O CPF é obrigatório.
            } @else if (cpf.hasError('pattern')) {
              O CPF deve conter exatamente 11 números.
            }
          </small>
        }
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">E-mail:</span>
        <input type="text" class="form-control" placeholder="Digite aqui o seu e-mail..." formControlName="email" />
        @if (email.invalid && email.touched) {
          <small class="text-danger">
            @if (email.hasError('required')) {
              O e-mail é obrigatório.
            } @else if (email.hasError('email')) {
              Digite um e-mail válido.
            }
          </small>
        }
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">Senha:</span>
        <input type="password" class="form-control" placeholder="***************" formControlName="senha" />
        @if (senha.invalid && senha.touched) {
          <small class="text-danger">
            @if (senha.hasError('required')) {
              A senha é obrigatória.
            } @else if (senha.hasError('minlength')) {
              A senha deve ter pelo menos 6 caracteres.
            }
          </small>
        }
      </div>

      <div class="mx-5 mt-2 text-start">
        <span class="form-label input-span">Confirmar senha:</span>
        <input type="password" class="form-control" placeholder="***************" formControlName="confirmarSenha" />
        @if (confirmarSenha.touched) {
          <small class="text-danger">
            @if (confirmarSenha.hasError('required')) {
              Confirme a sua senha.
            } @else if (formCadastro.hasError('senhasDiferentes')) {
              As senhas não conferem.
            }
          </small>
        }
      </div>

      @if (erroCadastro) {
        <div class="alert alert-danger mx-5 mt-3 py-2" role="alert">{{ erroCadastro }}</div>
      }

      <button type="button" class="btn btn-success mx-5 mt-4" (click)="cadastrar()">Cadastrar</button>
    </div>
  </div>
</div>
```
</details>

<details>
<summary>📄 <code>app.routes.ts</code> (clique para ver)</summary>

```ts
import { Routes } from '@angular/router';
import { Home } from './modules/pages/home/home';
import { Login } from './modules/pages/login/login';
import { Register } from './modules/pages/register/register';
import { CineifNavbar } from './modules/layout/cineif-navbar/cineif-navbar';

export const routes: Routes = [
  {
    path: '',
    component: CineifNavbar,
    children: [
      {
        path: '',
        component: Home,
      },
    ],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Register,
  },
];
```
</details>

**Realize os testes:**

| # | Teste | Resultado esperado |
|---|---|---|
| 1 | Clicar em **Cadastrar** com tudo vazio | Todas as mensagens de "obrigatório" aparecem |
| 2 | Nome com 2 letras | "O nome deve ter pelo menos 3 letras." |
| 3 | CPF `123` ou com pontos (`123.456.789-00`) | "O CPF deve conter exatamente 11 números." |
| 4 | E-mail `abc` | "Digite um e-mail válido." |
| 5 | Senha com 4 caracteres | "A senha deve ter pelo menos 6 caracteres." |
| 6 | Senhas diferentes | "As senhas não conferem." |
| 7 | Usar o e-mail `aluno@if.edu.br` (já existe) | Alerta "Já existe um usuário cadastrado com este e-mail." |
| 8 | Cadastro válido com e-mail novo | Vai para a Home **já logado**, com o seu nome na navbar |
| 9 | `F12 → Local Storage → cineif_usuarios` | O novo usuário (com CPF) está na lista |
| 10 | Sair e logar com o usuário recém-criado | Funciona! |

---

# 🎞️ Etapa 4 — Testando a Página HOME

**Conceitos:** Diretiva de Repetição FOR (`@for`) · Pipes (formatação de dados)

Para finalizar, vamos listar os filmes em cartaz na Home. Como ainda não temos um servidor de dados, usaremos uma **lista fixa** no TypeScript.

## 4.1 Os dados (vetor de filmes)

No `home.ts`, **copie o código abaixo**: uma `interface` que descreve o formato de um filme, e um vetor (*array*) com 5 filmes de 2026:

```ts
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

interface Filme {
  nome: string;
  duracao: string;
  dataEstreia: Date;
  classificacao: string;
}

@Component({
  selector: 'app-home',
  imports: [DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // Atenção: no objeto Date, o mês começa em 0 (janeiro = 0, abril = 3, ...)
  filmes: Filme[] = [
    { nome: 'Super Mario Galaxy: O Filme', duracao: '1h 38min', dataEstreia: new Date(2026, 3, 1), classificacao: '6 anos' },
    { nome: 'Michael', duracao: '2h 07min', dataEstreia: new Date(2026, 3, 23), classificacao: '12 anos' },
    { nome: 'O Diabo Veste Prada 2', duracao: '2h 00min', dataEstreia: new Date(2026, 3, 30), classificacao: '12 anos' },
    { nome: 'Star Wars: O Mandaloriano e Grogu', duracao: '2h 12min', dataEstreia: new Date(2026, 4, 21), classificacao: '14 anos' },
    { nome: 'Toy Story 5', duracao: '1h 42min', dataEstreia: new Date(2026, 5, 18), classificacao: '6 anos' },
  ];
}
```

> 📌 **Detalhes importantes:**
> - O nome do campo é `classificacao` (sem acento): é boa prática não usar acentos em nomes de variáveis.
> - `new Date(2026, 3, 1)` é **1º de abril** de 2026, porque os meses começam em **0**. (Evite `new Date('2026-04-01')`: esse formato é interpretado em horário UTC e, no Brasil, pode exibir o **dia anterior**!)
> - Já deixamos o `DatePipe` no `imports`, vamos usá-lo logo abaixo.
> - As datas de estreia são as do Brasil; a duração pode variar alguns minutos conforme a fonte.

## 4.2 🛠️ Mão na Massa: Diretiva de Repetição FOR (Repeat Directive `@for`)

### Para que serve?

O `@for` **repete um pedaço de HTML para cada item** de uma lista. Assim não precisamos escrever uma linha para cada filme: se a lista tiver 5 ou 500 filmes, o HTML é o mesmo.

### A forma nova (Angular 17+): bloco `@for`

```html
@for (item of lista; track item.id) {
  <!-- HTML repetido para cada item -->
} @empty {
  <!-- (opcional) HTML mostrado se a lista estiver vazia -->
}
```

- `item` é o nome que damos ao elemento da vez (como no `for...of` do TypeScript);
- `track` é **obrigatório**: informa qual propriedade identifica cada item de forma única, para o Angular atualizar a tela com eficiência quando a lista mudar. Aqui usaremos o `nome` do filme.

### Como era feito antes: `*ngFor`

```html
<!-- ANTES (Angular 16 ou anterior) -->
<li *ngFor="let filme of filmes; trackBy: identificarFilme"> ... </li>
```

Exigia importar `NgFor` (ou `CommonModule`), e o `trackBy` precisava de uma função no TypeScript.

### Passo a passo

Substitua o conteúdo do `home.html` (`home works!`) por:

```html
<div class="container-xxl mt-4">
  <h2 class="titulo">Lançamentos 2026:</h2>

  <ul class="list-group">
    @for (filme of filmes; track filme.nome) {
      <li class="list-group-item">
        <strong>{{ filme.dataEstreia | date: 'dd/MM/yyyy' }}</strong> :
        {{ filme.nome }} - {{ filme.duracao }} ({{ filme.classificacao }})
      </li>
    } @empty {
      <li class="list-group-item">Nenhum filme encontrado.</li>
    }
  </ul>
</div>
```

E no `home.scss`:

```scss
.titulo {
    color: #43964c;
    font-weight: bold;
}
```

### Entendendo o resultado

Cada `<li>` segue o formato **`Data Estreia : Nome - duração (Classificação)`**, por exemplo:

> **01/04/2026** : Super Mario Galaxy: O Filme - 1h 38min (6 anos)

Repare que reutilizamos a **interpolação** `{{ }}` da Etapa 1, só que agora lendo os dados de cada `filme` da vez.

### O que é aquele `| date: 'dd/MM/yyyy'`?

O símbolo `|` aplica um **Pipe** (*tubo*): uma função de formatação para usar no HTML. Sem ele, o `Date` apareceria como um texto enorme (`Wed Apr 01 2026 00:00:00 GMT-0300...`). O pipe `date` recebe o formato desejado. Por ser um recurso externo ao HTML básico, precisou ser **importado** (`DatePipe`) no `imports` do componente, assim como fizemos com `FormsModule` e `ReactiveFormsModule`.

### 🧪 Experimentos

1. Esvazie o vetor (`filmes: Filme[] = [];`): deve aparecer "Nenhum filme encontrado." (bloco `@empty`).
2. Acrescente um filme novo ao vetor e salve: a lista cresce **sem mexer no HTML**.
3. Troque o formato da data para `'dd/MM'` ou `'MMMM yyyy'`.

## 4.3 ✅ Conferência Final

<details>
<summary>📄 <code>home.html</code> (clique para ver)</summary>

```html
<div class="container-xxl mt-4">
  <h2 class="titulo">Lançamentos 2026:</h2>

  <ul class="list-group">
    @for (filme of filmes; track filme.nome) {
      <li class="list-group-item">
        <strong>{{ filme.dataEstreia | date: 'dd/MM/yyyy' }}</strong> :
        {{ filme.nome }} - {{ filme.duracao }} ({{ filme.classificacao }})
      </li>
    } @empty {
      <li class="list-group-item">Nenhum filme encontrado.</li>
    }
  </ul>
</div>
```
</details>

---

# 🏁 Checklist Final

- [ ] Navbar: troca de área entre logado/deslogado (`@if`), mostra o nome (`{{ }}`) e os botões funcionam (`(click)`)
- [ ] Login: `[(ngModel)]`, mensagem de erro, redirecionamento para a Home
- [ ] Cadastro: formulário reativo com validações, mensagens de erro, login automático após cadastrar
- [ ] Home: lista de filmes com `@for` e datas formatadas com o pipe `date`
- [ ] Fluxo completo: cadastrar → entrar → sair → logar de novo

---

# 📚 Resumo dos Conceitos

| Conceito (PT) | Concept (EN) | Sintaxe | Direção dos dados | Onde usamos |
|---|---|---|---|---|
| Diretiva Condicional IF | Conditional `@if` | `@if (cond) { } @else { }` | — | Navbar, alertas de erro |
| Interpolação | Interpolation / One-Way Data Binding | `{{ variavel }}` | TS → HTML | Nome do usuário, filmes |
| Evento de Clique | Click Event / Event Binding | `(click)="funcao()"` | HTML → TS | Navbar, botões |
| Vinculação Bidirecional | Two-Way Data Binding | `[(ngModel)]="variavel"` | TS ⇄ HTML | Login |
| Formulário Orientado a Template | Template-Driven Form | `FormsModule` + `ngModel` | TS ⇄ HTML | Login |
| Formulário Reativo | Reactive Form | `[formGroup]`, `formControlName` | TS ⇄ HTML | Cadastro |
| Validadores | Validators | `Validators.required`... | — | Cadastro |
| Diretiva de Repetição FOR | Repeat `@for` | `@for (x of lista; track x.id) { }` | — | Home |
| Pipe | Pipe | `{{ valor \| date: 'dd/MM/yyyy' }}` | — | Home |
| Injeção de Dependência | Dependency Injection | `inject(Servico)` | — | Todos os componentes |
| Rota | Route | `{ path: 'login', component: Login }` | — | `app.routes.ts` |

---

# 🛟 Erros Comuns e Como Resolver

| Mensagem de erro (Console / terminal) | Causa provável | Solução |
|---|---|---|
| `NG8002: Can't bind to 'ngModel' since it isn't a known property of 'input'` | Esqueceu de importar o `FormsModule` | Adicione-o ao `imports` do `Login` |
| `NG8002: Can't bind to 'formGroup' since it isn't a known property...` | Esqueceu o `ReactiveFormsModule` | Adicione-o ao `imports` do `Register` |
| `NG8004: No pipe found with name 'date'` | Esqueceu o `DatePipe` | Adicione-o ao `imports` do `Home` |
| `Cannot match any routes. URL Segment: 'cadastro'` | A rota `/cadastro` não está no `app.routes.ts` | Confira a Etapa 3.2 |
| Cliquei em sair e a tela não mudou | Faltou `this.userLogado = null` no `logout()` | Veja a Parte B da seção 1.5 |
| Login/cadastro e a navbar mostra sempre o usuário de teste | A linha de login automático ainda está no `ngOnInit` | Remova-a (seção 2.5, Passo 5) |
| Uma data aparece com 1 dia a menos | Usou `new Date('2026-04-01')` (UTC) | Use `new Date(2026, 3, 1)` |
| Mensagens de erro do cadastro nunca aparecem | `formControlName` com nome diferente do `FormGroup` | Confira a grafia (`confirmarSenha`, `cpf`...) |
| Alterei o código e nada mudou | Erro de compilação no terminal | Olhe o terminal do `npm start` e leia a mensagem |

---

# 🚀 Desafios Extras (Opcional)

1. **Link para voltar:** na tela de cadastro, adicione o texto *"Já possui um perfil? Faça login!"* levando para `/login`.
2. **Destaque de erro:** use o *class binding* `[class.is-invalid]="nome.invalid && nome.touched"` nos inputs para pintá-los de vermelho (classe do Bootstrap).
3. **Cores por classificação:** use o bloco `@switch` (pesquise na documentação) para mostrar um selo colorido conforme a classificação do filme.
4. **Validação real de CPF:** crie um validador personalizado que calcule os dígitos verificadores.
5. **Home personalizada:** mostre "Bem-vindo, *nome*!" acima da lista apenas quando houver usuário logado. (Dica: a Home precisará injetar o `AuthService`.)
6. **Mais filmes:** acrescente outros lançamentos ao vetor e ordene a lista por data de estreia.

> 📖 Documentação oficial (em inglês): https://angular.dev
