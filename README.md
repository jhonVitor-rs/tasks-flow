# 🧩 TaskFlow - Monorepo de Gerenciamento de Tarefas

Este projeto é uma aplicação fullstack construída com **Turborepo**, composta por múltiplos serviços em **NestJS** e um frontend em **Vite + React**. A arquitetura é orientada a mensagens com **RabbitMQ**, e todos os serviços estão containerizados com **Docker**.

---

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

---

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

---

## 🔐 Funcionalidades

- **Autenticação**: Login, registro e refresh token (HTTP-only cookies)
- **Tarefas**: CRUD completo + comentários
- **Notificações**: Eventos disparados ao criar/editar/comentar tarefas, enviados via WebSocket
- **Gateway**: Ponto único de entrada, comunicação assíncrona via RabbitMQ

---

## 🏗 Decisões Técnicas

- **Arquitetura CQRS**:  
  Optamos por CQRS para:
  - Desacoplar responsabilidades entre leitura e escrita.
  - Facilitar o disparo de eventos para outros serviços (ex.: notificações).
  - Melhorar escalabilidade e manutenção.

- **Mensageria com RabbitMQ**:  
  Permite comunicação assíncrona entre serviços, garantindo resiliência e desacoplamento.

- **Frontend com Vite + React**:  
  Escolhido pela performance e simplicidade, aliado ao **TanStack Router** e **TanStack Query** para rotas e gerenciamento de estado.

---

## ⚠️ Problemas Conhecidos

- **Filtros e Paginação**:  
  Atualmente não implementados. A solução planejada é **carregamento dinâmico** (infinite scroll), semelhante ao feed do Facebook/Instagram.

---

## ⏱ Tempo de Desenvolvimento

- **Frontend**: ~1 semana
- **Backend**: ~1 semana

---

## 🐳 Executando com Docker

```bash
docker-compose up --build
```

---

## 🔮 Próximos Passos

- Implementar filtros e paginação dinâmica.
- Melhorar testes de integração.
- Adicionar documentação detalhada por serviço.

---

<img width="1024" height="683" alt="image" src="https://github.com/user-attachments/assets/b2358e33-d812-4017-a860-30c4661088d8" />

