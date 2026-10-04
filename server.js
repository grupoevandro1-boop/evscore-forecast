const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const leagueCatalog = [
  { id: 39, name: 'Premier League' },
  { id: 140, name: 'La Liga' },
  { id: 135, name: 'Serie A' },
  { id: 78, name: 'Bundesliga' },
  { id: 61, name: 'Ligue 1' },
  { id: 2, name: 'UEFA Champions League' },
  { id: 71, name: 'Brasileirão' },
  { id: 88, name: 'Eredivisie' },
  { id: 94, name: 'Primeira Liga' },
  { id: 1, name: 'World Cup' },
];

const fallbackFixtures = [
  {
    id: 1001,
    league: 'Premier League',
    kickoff: '2026-10-05T18:30:00Z',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    status: 'PRÓXIMO',
    homeGoals: 2,
    awayGoals: 1,
    odds: { home: 1.9, draw: 3.35, away: 3.8 },
    goalMarginLast10: 8,
    form: 'WWDWL',
    confidence: 82,
    pick: 'Casa com mais de 1.5 gols',
  },
  {
    id: 1002,
    league: 'La Liga',
    kickoff: '2026-10-05T20:00:00Z',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    status: 'PRÓXIMO',
    homeGoals: 1,
    awayGoals: 1,
    odds: { home: 2.1, draw: 3.25, away: 2.95 },
    goalMarginLast10: 6,
    form: 'WWLWW',
    confidence: 78,
    pick: 'Empate ou Real Madrid',
  },
  {
    id: 1003,
    league: 'Serie A',
    kickoff: '2026-10-06T19:00:00Z',
    homeTeam: 'Inter',
    awayTeam: 'Juventus',
    status: 'PRÓXIMO',
    homeGoals: 0,
    awayGoals: 0,
    odds: { home: 1.78, draw: 3.5, away: 4.35 },
    goalMarginLast10: 9,
    form: 'WWWLD',
    confidence: 83,
    pick: 'Inter vence',
  },
  {
    id: 1004,
    league: 'Bundesliga',
    kickoff: '2026-10-06T18:00:00Z',
    homeTeam: 'Bayern',
    awayTeam: 'Dortmund',
    status: 'PRÓXIMO',
    homeGoals: 1,
    awayGoals: 2,
    odds: { home: 1.6, draw: 4.0, away: 5.0 },
    goalMarginLast10: 7,
    form: 'WWWLW',
    confidence: 79,
    pick: 'Casa e over 2.5',
  },
  {
    id: 1005,
    league: 'Ligue 1',
    kickoff: '2026-10-07T21:00:00Z',
    homeTeam: 'PSG',
    awayTeam: 'Marseille',
    status: 'PRÓXIMO',
    homeGoals: 2,
    awayGoals: 0,
    odds: { home: 1.58, draw: 4.2, away: 5.4 },
    goalMarginLast10: 10,
    form: 'WWWWW',
    confidence: 88,
    pick: 'PSG vence e over 2.5',
  },
  {
    id: 1006,
    league: 'Brasileirão',
    kickoff: '2026-10-08T19:30:00Z',
    homeTeam: 'Flamengo',
    awayTeam: 'Palmeiras',
    status: 'PRÓXIMO',
    homeGoals: 1,
    awayGoals: 2,
    odds: { home: 2.45, draw: 3.2, away: 2.75 },
    goalMarginLast10: 5,
    form: 'DWWWL',
    confidence: 74,
    pick: 'Fora ou empate',
  },
];

function shiftDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeFixture(raw) {
  const fixture = raw?.fixture ?? {};
  const teams = raw?.teams ?? {};
  const goals = raw?.goals ?? {};
  const league = raw?.league ?? {};

  return {
    id: fixture.id ?? Math.round(Math.random() * 100000),
    league: league.name ?? 'Liga principal',
    kickoff: fixture.date ?? new Date().toISOString(),
    homeTeam: teams.home?.name ?? 'Time da casa',
    awayTeam: teams.away?.name ?? 'Time visitante',
    status: fixture.status?.short ?? 'PRÓXIMO',
    homeGoals: typeof goals.home === 'number' ? goals.home : undefined,
    awayGoals: typeof goals.away === 'number' ? goals.away : undefined,
    odds: {
      home: raw?.odds?.home ?? 1.9,
      draw: raw?.odds?.draw ?? 3.2,
      away: raw?.odds?.away ?? 3.8,
    },
    goalMarginLast10: Math.floor(Math.random() * 9) - 2,
    form: 'WWDWL',
    confidence: 70 + Math.floor(Math.random() * 22),
    pick: ['Casa com mais de 1.5 gols', 'Fora ou empate', 'Empate com gols', 'Inter vence', 'PSG vence e over 2.5'][Math.floor(Math.random() * 5)],
  };
}

async function fetchFixtures() {
  const key = process.env.API_FOOTBALL_KEY;
  const host = process.env.API_FOOTBALL_HOST || 'v3.football.api-sports.io';

  if (!key) {
    return fallbackFixtures;
  }

  const from = shiftDate(-1);
  const to = shiftDate(3);

  try {
    const requests = leagueCatalog.map(async (league) => {
      const response = await fetch(
        `https://${host}/fixtures?league=${league.id}&season=2025&from=${from}&to=${to}`,
        {
          headers: {
            'x-rapidapi-key': key,
            'x-rapidapi-host': host,
          },
        },
      );

      if (!response.ok) return [];
      const data = await response.json();
      return (data.response || []).map(normalizeFixture);
    });

    const results = await Promise.all(requests);
    const flattened = results.flat();
    return flattened.length ? flattened.slice(0, 24) : fallbackFixtures;
  } catch (error) {
    console.error(error);
    return fallbackFixtures;
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'EVSCORE ready' });
});

app.get('/api/fixtures', async (_req, res) => {
  try {
    const fixtures = await fetchFixtures();
    res.json({ generatedAt: new Date().toISOString(), fixtures });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao carregar jogos.', fixtures: fallbackFixtures });
  }
});

app.listen(PORT, () => {
  console.log(`EVSCORE API running on http://localhost:${PORT}`);
});
