# JobConnect API - Sistema de Gestão de Vagas

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**API REST para conectar empresas e candidatos em um ecossistema completo de gestão de vagas de emprego.**

[Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias) • [Arquitetura](#-arquitetura) • [Instalação](#-instalação)

</div>

---

## Sobre o Projeto

O **JobConnect API** é um sistema backend completo desenvolvido para gerenciar todo o ciclo de vida de vagas de emprego, desde a publicação até o feedback final aos candidatos. Com uma arquitetura em camadas bem definida, este projeto demonstra boas práticas de desenvolvimento backend moderno.

### Problema Resolvido

- **Para Empresas**: Plataforma centralizada para publicar vagas, gerenciar candidaturas e enviar feedbacks personalizados
- **Para Candidatos**: Sistema intuitivo para buscar vagas, candidatar-se e receber retorno sobre suas aplicações
- **Segurança**: Autenticação JWT robusta com controle de acesso baseado em roles (empresa/usuário)

---

## Limitações e Contexto Técnico

Apesar de totalmente funcional, o projeto ainda passará por melhorias tanto na interface quanto no backend.

- **O projeto foi desenvolvido seguindo o protocolo de comunicação xlxs que encontra-se na pasta raiz do repositório e devidamente identificado, com o objetivo de garantir que o backend e o frontend tenham plena comunicação e evitando problemas.**

- **Tal protocolo foi construído pela própria turma da disciplina Cliente-Servidor, não representando necessariamente as melhores práticas e um protocolo de comunicação backend-frontend profissional.**

- **Este projeto foi desenvolvido considerando as limitações de infraestrutura dos laboratórios da UTFPR, onde será apresentado:**

### Restrições do Ambiente

- **Node.js 18.14.0:** Versão fixa instalada nos laboratórios, impedindo o uso de recursos mais recentes
- **Sem Banco de Dados:** Ausência de SGBD (MySQL, PostgreSQL, MongoDB) instalados
- **Sem Docker:** Impossibilidade de containerização e orquestração de serviços
- **Hardware Limitado:** Recursos computacionais restritos para execução de serviços pesados

### Decisões Arquiteturais

Devido às limitações acima, o projeto foi estruturado com:

- **Utilização do SQLite como banco de dados:** Dados armazenados com SQLite que independe de instalação prévia nos computadores dos laboratórios
- **Tecnologias Leves:** Escolha de bibliotecas e frameworks com baixo overhead
- **Compatibilidade com Node 18.14:** Código e dependências compatíveis com versões antigas do Node.js
- **Sem Containerização:** Não utilização de Docker/Kubernetes

### Considerações

Em um ambiente de produção real, as seguintes melhorias seriam implementadas:

- Migração para banco de dados relacional mais robusto e escalável (PostgreSQL) ou NoSQL (MongoDB)
- Containerização com Docker para facilitar deploy e escalabilidade
- Utilização de Node.js mais recente com recursos modernos
- Implementação de cache com Redis
- Possível deploy em plataformas cloud (AWS, Azure, GCP)
- CI/CD automatizado com testes integrados

---

## Funcionalidades

### Gestão de Usuários
- Cadastro e autenticação de candidatos
- Perfil completo com experiência profissional e educação
- Atualização de dados pessoais
- Visualização de candidaturas com status e feedback

### Gestão de Empresas
- Cadastro e autenticação de empresas
- Perfil corporativo com informações de contato
- Gerenciamento de múltiplas vagas
- Visualização de candidatos por vaga

### Gestão de Vagas
- Criação e edição de vagas de emprego
- Busca avançada com filtros (área, localização, salário)
- Associação automática com empresa
- Controle de candidaturas recebidas

### Sistema de Candidaturas
- Candidatura simplificada a vagas
- Prevenção de candidaturas duplicadas
- Histórico completo de candidaturas
- Dados detalhados do candidato

### Sistema de Feedback
- Empresas podem enviar feedback aos candidatos
- Candidatos visualizam feedback em suas candidaturas
- Histórico de feedbacks por vaga
- Melhora na experiência do candidato

---

## 🛠 Tecnologias

### Core
- **Node.js** 
- **TypeScript** 
- **Express.js** 

### Banco de Dados
- **Sequelize ORM** 
- **SQLite** 

### Segurança & Validação
- **JWT (jsonwebtoken)** - Autenticação stateless
- **bcrypt** - Hash de senhas
- **Zod** - Validação de schemas TypeScript-first

### Ferramentas
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 🏗 Arquitetura

O projeto segue o padrão **MVC aprimorado** com separação clara de responsabilidades:

```
src/
├── controllers/      # Camada de controle (lida com requisições HTTP)
├── services/         # Camada de negócio (lógica da aplicação)
├── repository/       # Camada de dados (acesso ao banco)
├── models/           # Modelos Sequelize (definição de tabelas)
├── schemas/          # Schemas Zod (validação de entrada)
├── routes/           # Definição de rotas e injeção de dependências
├── middlewares/      # Autenticação, logging, tratamento de erros
├── database/         # Configuração do banco de dados
└── @types/           # Definições TypeScript customizadas
```

### Padrões Implementados

- **Dependency Injection**: Injeção via construtor para facilitar testes
- **Repository Pattern**: Abstração do acesso a dados
- **DTO Pattern**: Validação com Zod schemas
- **JWT Authentication**: Autenticação stateless moderna

---

## Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/MatheusAndreiczuk/projeto-cliente-servidor-backend.git
cd projeto-cliente-servidor-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
JWT_SECRET=seu_secret_super_seguro_aqui
NODE_ENV=development
```

4. **Compile o TypeScript**
```bash
npm run build
```

5. **Inicie o servidor**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000` 🎉

---

## Autenticação e Autorização

O sistema implementa **JWT (JSON Web Token)** com controle de acesso baseado em roles:

### Fluxo de Autenticação

1. **Login**: Usuário/Empresa faz login e recebe um token JWT
2. **Token**: Token contém `id`, `role` (user/company) e expira em 24h
3. **Autorização**: Middleware valida token e verifica permissões

### Regras de Acesso

| Endpoint | Role Permitido | Validação Adicional |
|----------|----------------|---------------------|
| `POST /users` | Público | - |
| `GET /users/:id` | user | Apenas próprio usuário |
| `GET /users/:user_id/jobs` | user | Apenas próprias candidaturas |
| `POST /companies` | Público | - |
| `POST /jobs` | company | Apenas empresa autenticada |
| `POST /jobs/:id` | user | Usuário autenticado |
| `POST /jobs/:job_id/feedback` | company | Apenas empresa dona da vaga |

---

## Melhorias Futuras

- [ ] Testes automatizados (Jest/Supertest)
- [ ] Documentação Swagger/OpenAPI
- [ ] Paginação de resultados
- [ ] Upload de currículos (PDF)
- [ ] Sistema de notificações (email)
- [ ] Métricas e monitoramento
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] Migração para PostgreSQL
- [ ] Docker containerization

---


<div align="center">

**⭐ Se gostou do projeto, considere dar uma estrela!**

</div>
