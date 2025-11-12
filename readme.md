# Projeto - Backend Cliente-Servidor (Express + Sequelize + SQLite)

Este repositório contém um backend em Node.js/TypeScript usando Express, Sequelize e SQLite.

Este README descreve como rodar o projeto a partir de um arquivo .zip que NÃO contém as pastas listadas em `.gitignore` (por exemplo `node_modules` e `dist`).

## Pré-requisitos

- Node.js (recomenda-se Node 18+)
- npm (vem com o Node.js)

## Passos para rodar (Windows / PowerShell)

1. Baixe e extraia o arquivo .zip do projeto. O .zip NÃO contém `node_modules` nem `dist`.

   - Usando o Explorador do Windows: clique com o botão direito -> Extrair Tudo...
   - Ou via PowerShell (exemplo):

```powershell
# ajustando nomes conforme seu arquivo
Expand-Archive -Path .\projeto-backend.zip -DestinationPath .\projeto-backend
cd .\projeto-backend\projeto-cliente-servidor-backend-main
```

2. Entre na pasta do projeto:

```powershell
cd .\projeto-cliente-servidor-backend-main
```

3. Instale as dependências (já que `node_modules` não veio no zip):

```powershell
npm install
```

4. Crie o arquivo de variáveis de ambiente a partir do exemplo fornecido:

```powershell
Copy-Item .env.example .env
# ou, se preferir editar manualmente, abra .env.example e crie .env com as mesmas variáveis
```

5. Build (TypeScript -> JavaScript):

```powershell
npm run build
```

6. Rodar a aplicação:

- Em modo "dev" (faz build e executa):

```powershell
npm run dev
```

- Em produção (assumindo que já fez `npm run build`):

```powershell
npm start
```

7. A API deverá estar disponível no endereço e porta configurados no código (ver `src/server.js` ou `dist/server.js` após build). Se a porta estiver hardcoded, confira esse arquivo para o valor exato.

## Variáveis de ambiente

O projeto traz um arquivo `.env.example` com pelo menos as variáveis:

- `JWT_SECRET` - segredo para geração de tokens JWT
- `JWT_EXPIRES_IN` - tempo de expiração do token (em segundos)

Copie essas variáveis para `.env` e ajuste conforme necessário.

## Banco de dados

Este projeto usa `sqlite3` via Sequelize. Normalmente não é necessário criar manualmente o arquivo de banco de dados — ele será criado automaticamente quando a aplicação inicializar e executar operações/seed/migrations (se houver suporte no código). Se encontrar problemas relacionados ao DB, verifique o arquivo `src/database/db.js`.

## Erros comuns / Troubleshooting

- Erro: "module not found" após descompactar o zip — execute `npm install`.
- Erro: problemas com TypeScript/compilação — verifique se o `tsc` está instalado (está como dependência do projeto) e rode `npm run build` para gerar `dist/`.
- Erro ao iniciar após build — confira se `dist/server.js` existe; se não existir, rode `npm run build` e verifique mensagens de erro no terminal.
- Porta em uso — ajuste a porta no arquivo de configuração/servidor ou pare o processo que está usando a porta.

## Comandos úteis

```powershell
# instalar dependências
npm install

# copiar variáveis de ambiente (PowerShell)
Copy-Item .env.example .env

# build
npm run build

# rodar em dev
npm run dev

# rodar em produção
npm start
```

## Observações sobre o zip

O .zip fornecido para entrega normalmente não inclui `node_modules` nem `dist` (esses arquivos são listados em `.gitignore`). Por isso, após extrair, é obrigatório executar `npm install` e `npm run build` antes de tentar executar o projeto.

---

Arquivo criado automaticamente por assistente com instruções para rodar o projeto no Windows (PowerShell).
