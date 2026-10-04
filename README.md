# EVSCORE

Aplicativo de prognósticos de futebol, análise de odds e palpites seguros com dados automáticos de ligas principais do mundo.

## Visão geral

- painel com jogos do dia e próximos 3 dias
- dados de ligas e estatísticas por equipe
- integração com API de futebol opcional
- palpites com maior consistência e margem de gols

## Como executar

```bash
npm install
npm run dev
```

O front-end fica em:

```bash
http://localhost:5173
```

A API fica em:

```bash
http://localhost:3001/api/fixtures
```

## Variáveis de ambiente

```bash
cp .env.example .env
```

Se a chave da API não estiver configurada, o app usa dados de exemplo para manter o funcionamento.
