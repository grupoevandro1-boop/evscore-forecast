# EVSCORE

Aplicativo de prognósticos de futebol, analise de odds e palpites seguros com dados automáticos de ligas principais do mundo.

## Visão geral

- painel com jogos do dia e próximos 3 dias
- integração com API de futebol (opcional)
- cálculo de margem de gols últimos 10 jogos
- lista com ligas principais do mundo
- seleção de palpites fortes com base em tendências e odds

## Como executar

```bash
npm install
npm run dev
```

O frontend fica em:

```bash
http://localhost:5173
```

A API fica em:

```bash
http://localhost:3001/api/fixtures
```

## Variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e informe sua chave da API Football:

```bash
cp .env.example .env
```

## Observação

Se a chave não estiver configurada, o backend usa dados de exemplo para manter o app funcionando e demonstrar o fluxo completo.
