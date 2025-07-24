# NLW Server AI – Documentação Técnica Avançada

## Sumário
- [Visão Geral](#visão-geral)
- [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
- [Modelagem de Dados e Banco](#modelagem-de-dados-e-banco)
- [API: Endpoints e Fluxos](#api-endpoints-e-fluxos)
- [Integração com Google Gemini](#integração-com-google-gemini)
- [Configuração e Variáveis de Ambiente](#configuração-e-variáveis-de-ambiente)
- [Setup com Docker](#setup-com-docker)
- [Scripts e Desenvolvimento](#scripts-e-desenvolvimento)
- [Boas Práticas e Qualidade](#boas-práticas-e-qualidade)
- [Testes de API](#testes-de-api)
- [Contribuição](#contribuição)
- [Troubleshooting & Segurança](#troubleshooting--segurança)

---

## Visão Geral

Este projeto é um servidor backend para aplicações de IA, focado em transcrição de áudio, geração de embeddings e respostas contextuais, utilizando Fastify, Drizzle ORM, PostgreSQL (com pgvector) e integração com a API Google Gemini. O sistema é modular, seguro, escalável e pronto para produção.

---

## Arquitetura e Tecnologias

### Principais Tecnologias
- **Node.js**: Ambiente de execução JavaScript moderno.
- **TypeScript**: Tipagem estática, segurança e produtividade.
- **Fastify**: Framework HTTP de alta performance, com suporte a validação e plugins.
- **Drizzle ORM**: ORM SQL type-safe, com integração nativa ao TypeScript e suporte a migrações.
- **PostgreSQL + pgvector**: Banco relacional robusto, com extensão para operações vetoriais (AI/ML).
- **Zod**: Validação de esquemas e dados, integrada ao Fastify.
- **@google/genai**: SDK oficial para integração com a API Gemini (transcrição, embeddings, respostas).
- **Docker & Docker Compose**: Ambientes isolados e reprodutíveis.
- **Biome**: Linter e formatter rápido para TypeScript.
- **pnpm**: Gerenciador de pacotes eficiente.

### Organização do Código
```
src/
  db/
    connection.ts      # Conexão e setup do Drizzle/Postgres
    schema/            # Schemas das tabelas (rooms, questions, audio_chunks)
    migrations/        # Migrações versionadas SQL
    seed.ts            # Seed automatizado com drizzle-seed
  http/
    routes/            # Rotas HTTP (REST)
  services/
    gemini.ts          # Integração com Google Gemini
  env.ts               # Validação de variáveis de ambiente
  server.ts            # Bootstrap do servidor Fastify
```

---

## Modelagem de Dados e Banco

### Estrutura das Tabelas
- **rooms**: Salas de contexto para áudios e perguntas
  - `id` (UUID, PK)
  - `name` (TEXT, obrigatório)
  - `description` (TEXT, opcional)
  - `created_at` (TIMESTAMP)
- **audio_chunks**: Trechos de áudio transcritos e vetorizados
  - `id` (UUID, PK)
  - `room_id` (UUID, FK → rooms)
  - `transcription` (TEXT)
  - `embeddings` (VECTOR[768])
  - `created_at` (TIMESTAMP)
- **questions**: Perguntas feitas sobre o contexto de uma sala
  - `id` (UUID, PK)
  - `room_id` (UUID, FK → rooms)
  - `question` (TEXT)
  - `answer` (TEXT, opcional)
  - `created_at` (TIMESTAMP)

### Migrações e Seed
- Migrações SQL versionadas em `src/db/migrations/`.
- Seed automatizado com dados fake (faker) via `pnpm seed`.
- Extensão `pgvector` habilitada via Docker (`docker/setup.sql`).

---

## API: Endpoints e Fluxos

### Health Check
- `GET /health` → Retorna status do servidor.

### Rooms
- `GET /rooms` → Lista todas as salas, incluindo contagem de perguntas.
- `POST /rooms` → Cria uma nova sala.
  - Body: `{ name: string, description?: string }`
  - Response: `{ roomId: string }`

### Audio
- `POST /rooms/:roomId/audio` → Faz upload de áudio (multipart), transcreve, gera embeddings e armazena chunk.
  - Form: `audio` (file)
  - Response: `{ chunkId: string }`

### Questions
- `GET /rooms/:roomId/questions` → Lista perguntas e respostas de uma sala.
- `POST /rooms/:roomId/questions` → Cria pergunta, busca contexto relevante via similaridade vetorial, gera resposta com Gemini.
  - Body: `{ question: string }`
  - Response: `{ questionId: string, answer: string | null }`

#### Validação
- Todos os endpoints usam validação Zod (tipos, formatos, obrigatoriedade).
- Erros retornam status HTTP apropriado e mensagem detalhada.

#### Exemplo de Fluxo
1. Crie uma sala (`POST /rooms`).
2. Faça upload de áudios para a sala (`POST /rooms/:roomId/audio`).
3. Faça perguntas sobre o conteúdo enviado (`POST /rooms/:roomId/questions`).

---

## Integração com Google Gemini

- **Transcrição de Áudio**: Utiliza o modelo `gemini-2.5-flash` para transcrever áudios enviados em português do Brasil.
- **Geração de Embeddings**: Utiliza o modelo `text-embedding-004` para criar vetores de similaridade semântica.
- **Geração de Respostas**: Dada uma pergunta e contexto (transcrições mais similares), gera resposta textual objetiva, citando o "conteúdo da aula" quando apropriado.
- **Chave de API**: Necessário definir `GEMINI_API_KEY` no ambiente.

---

## Configuração e Variáveis de Ambiente

Crie um arquivo `.env` na raiz com:
```
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nlw-server-ai
GEMINI_API_KEY=... # Sua chave da API Gemini
```
- Todas as variáveis são validadas via Zod em `src/env.ts`.
- O projeto não inicia se variáveis obrigatórias estiverem ausentes ou inválidas.

---

## Setup com Docker

- Banco de dados PostgreSQL com extensão pgvector já habilitada.
- Volume persistente e script de inicialização em `docker/setup.sql`.
- Suba o banco com:
```bash
docker-compose up -d
```

---

## Scripts e Desenvolvimento

| Script                | Descrição                                 |
|-----------------------|-------------------------------------------|
| `pnpm dev`            | Inicia servidor em modo desenvolvimento   |
| `pnpm start`          | Inicia servidor em modo produção          |
| `pnpm seed`           | Popula o banco com dados fake             |
| `pnpm db:generate`    | Gera migrações com drizzle-kit            |
| `pnpm db:migrate`     | Aplica migrações no banco                 |

---

## Boas Práticas e Qualidade

- **Biome**: Lint e format automático (`pnpm biome lint .`, `pnpm biome format --write .`).
- **TypeScript**: Tipagem rigorosa em todo o projeto.
- **Validação Zod**: Segurança de dados em todas as entradas.
- **Arquitetura modular**: Separação clara de responsabilidades.
- **Tratamento de erros**: Mensagens claras e status HTTP corretos.

---

## Testes de API

- Utilize o arquivo `client.http` para testar endpoints via VSCode REST Client ou similar.
- Exemplos de uso com `curl`:
```bash
curl http://localhost:3333/health
curl http://localhost:3333/rooms
```

---

## Contribuição

1. Fork este repositório
2. Crie um branch: `git checkout -b feature/nome-da-feature`
3. Faça commits claros e objetivos
4. Abra um Pull Request detalhando sua contribuição

---

## Troubleshooting & Segurança

- **Banco não sobe?** Verifique logs do Docker e se a porta 5432 está livre.
- **Variáveis de ambiente inválidas?** Cheque o arquivo `.env` e o formato da URL do banco.
- **API Gemini**: Certifique-se de que a chave está correta e ativa.
- **Segurança**: Nunca exponha sua chave Gemini publicamente. Use variáveis de ambiente seguras em produção.
- **Recomendações**:
  - Use HTTPS em produção
  - Restrinja CORS conforme necessário
  - Monitore logs e falhas

---

## Fluxograma dos Fluxos Principais

```mermaid
flowchart TD
  A[Usuário] -->|POST /rooms| B[Criação de Sala]
  A -->|POST /rooms/:roomId/audio| C[Upload de Áudio]
  C --> D[Transcrição Gemini]
  D --> E[Embeddings Gemini]
  E --> F[Armazenamento em audio_chunks]
  A -->|POST /rooms/:roomId/questions| G[Criação de Pergunta]
  G --> H[Busca de Chunks por Similaridade]
  H --> I[Resposta Gemini]
  I --> J[Armazenamento em questions]
  A -->|GET /rooms| K[Listagem de Salas]
  A -->|GET /rooms/:roomId/questions| L[Listagem de Perguntas]
```

---

## Exemplos de Payloads

### Criar Sala
**POST /rooms**
```json
{
  "name": "Sala de IA",
  "description": "Discussão sobre inteligência artificial"
}
```
**Resposta:**
```json
{
  "roomId": "uuid"
}
```

### Upload de Áudio
**POST /rooms/:roomId/audio**
- Formulário multipart:
  - Campo: `audio` (arquivo de áudio)
**Resposta:**
```json
{
  "chunkId": "uuid"
}
```

### Criar Pergunta
**POST /rooms/:roomId/questions**
```json
{
  "question": "O que foi discutido sobre aprendizado supervisionado?"
}
```
**Resposta:**
```json
{
  "questionId": "uuid",
  "answer": "O conteúdo da aula abordou aprendizado supervisionado, explicando que..."
}
```

### Listar Salas
**GET /rooms**
**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "Sala de IA",
    "questionsCount": 3,
    "createdAt": "2024-06-01T12:00:00.000Z"
  }
]
```

### Listar Perguntas de uma Sala
**GET /rooms/:roomId/questions**
**Resposta:**
```json
{
  "questions": [
    {
      "id": "uuid",
      "question": "O que é IA?",
      "answer": "O conteúdo da aula define IA como...",
      "createdAt": "2024-06-01T12:10:00.000Z"
    }
  ]
}
```

---

**Desenvolvido com foco em IA, escalabilidade e segurança.** 