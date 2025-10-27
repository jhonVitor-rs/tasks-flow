# 🧩 TaskFlow - Monorepo de Gerenciamento de Tarefas

Este projeto é uma aplicação fullstack construída com **Turborepo**, composta por múltiplos serviços em **NestJS** e um frontend em **Vite + React**. A arquitetura é orientada a mensagens com **RabbitMQ**, e todos os serviços estão containerizados com **Docker**.

## 📦 Estrutura do Projeto

```
taskflow/
├── apps/
│   ├── api-gateway/       # Ponto único de entrada/saída da aplicação
│   ├── auth-service/      # Serviço de autenticação
│   ├── task-service/      # Serviço de criação e acompanhamento de tarefas
│   ├── notification-service/ # Serviço de envio de notificações
│   └── web/               # Frontend em Vite + React
├── packages/
│   └── shared/            # Tipos e utilitários compartilhados
├── docker-compose.yml
└── README.md
```

## 🧠 Tecnologias Utilizadas

### Backend
- **NestJS** com módulos independentes
- **CQRS** para separação de comandos e queries
- **TypeORM** com **PostgreSQL**
- **NestJS Microservices** com transporte via **RabbitMQ**
- **Docker** para orquestração dos serviços

### Frontend
- **Vite + React**
- **ShadCN UI** para componentes visuais
- **TanStack Router** para gerenciamento de rotas
- **TanStack Query + Axios** para requisições e cache de dados

## 🔐 Funcionalidades

### Autenticação
- Cadastro e login de usuários
- Tokens JWT

### Tarefas
- Criação, edição e exclusão de tarefas
- Visualização de lista de tarefas
- Tela dedicada para cada tarefa com comentários

### Notificações
- Envio de notificações entre serviços
- Integração com eventos do sistema

### Gateway
- Orquestra requisições entre os serviços
- Exposição de APIs públicas
- Comunicação assíncrona via RabbitMQ

## 🐳 Executando com Docker

```bash
# Subir todos os serviços
docker-compose up --build
```

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/b2358e33-d812-4017-a860-30c4661088d8" />

