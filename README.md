## Descrição
Plataforma full stack de gestão de usuários, com frontend em React + Tailwind e API em NestJS, autenticação segura com JWT em cookie httpOnly, controle de acesso por perfil (USER/ADMIN), CRUD de usuários, métricas em tempo real via Socket.IO e ambiente em transição para execução com Docker (API, PostgreSQL e Redis), como base para evolução para um produto de banco digital.

## Env
Este projeto roda em ambiente Linux e está em migração para Docker, com a API NestJS (Node/Express), PostgreSQL e Redis containerizados. O frontend é React + Vite + Tailwind + TypeScript, e a comunicação com a API é configurada por variáveis de ambiente (VITE_API_URL no frontend e PORT, DATABASE_URL, REDIS_*, JWT_* no backend/API).

## Estrutura do projeto (plaintext)

```text
cadastro/
├── api/                     # API NestJS + Prisma + testes
│   ├── src/
│   │   ├── auth/               # login, JWT, guards e sessoes
│   │   ├── users/              # CRUD de usuarios
│   │   ├── admin/              # metricas em tempo real (socket)
│   │   └── main.ts             # bootstrap da API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── test/                   # testes e2e
│   ├── .env                    # variaveis de ambiente do backend
│   └── package.json
├── frontend/                    # aplicacao React + Vite
│   ├── src/
│   │   ├── pages/              # Login, Register, Welcome, Admin, Edit
│   │   ├── components/         # componentes reutilizaveis
│   │   ├── hooks/              # hooks de regras de pagina
│   │   ├── api/                # client HTTP e funcoes de API
│   │   └── utils/              # utilitarios de frontend
│   ├── public/
│   ├── .env                    # variaveis de ambiente do frontend
│   └── package.json
├── app.sh                       # script para abrir backend e frontend
└── README.md
```

## Setup do projeto

```bash
$ cd api && npm install
$ cd ../frontend && npm install
```

## Compilar e rodar o projeto

```bash
# development
$ cd api && npm run start

# watch mode
$ cd api && npm run start:dev

# production mode
$ cd api && npm run start:prod
```

## Rodar o frontend

```bash
$ cd frontend && npm run dev
```

## Run tests

```bash
# unit tests
$ cd api && npm run test

# e2e tests
$ cd api && npm run test:e2e

# test coverage
$ cd api && npm run test:cov
```

## Deployment

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

## Obs
Eu não estou usando acentuação nos commits por uma questão de preferência.
Tenho o hábito de não colocar pontuação nas coisas que eu escrevo no terminal.

## License

Esse projeto é feito com base na licença MIT.

## Cobertura de testes
![screen](https://github.com/user-attachments/assets/7dc4b80f-9ebf-4ded-b409-5c4334ca3f0e)
