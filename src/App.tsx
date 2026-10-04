import { useEffect, useMemo, useState } from 'react';

type Odds = {
  home: number;
  draw: number;
  away: number;
};

type Fixture = {
  id: number;
  league: string;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  homeGoals?: number;
  awayGoals?: number;
  odds: Odds;
  goalMarginLast10: number;
  form: string;
  confidence: number;
  pick: string;
};

const fallbackFixtures: Fixture[] = [
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
];

function formatDate(date: string) {
  const parsed = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

function App() {
  const [fixtures, setFixtures] = useState<Fixture[]>(fallbackFixtures);
  const [league, setLeague] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/fixtures');
        if (!response.ok) throw new Error('Erro ao buscar jogos');
        const data = await response.json();
        if (Array.isArray(data.fixtures) && data.fixtures.length > 0) {
          setFixtures(data.fixtures);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const leagues = useMemo(
    () => ['Todos', ...new Set(fixtures.map((item) => item.league))],
    [fixtures],
  );

  const filtered = useMemo(() => {
    if (league === 'Todos') return fixtures;
    return fixtures.filter((item) => item.league === league);
  }, [fixtures, league]);

  const metrics = useMemo(() => {
    const initial = { total: filtered.length, highConfidence: 0 };
    return filtered.reduce((acc, item) => {
      if (item.confidence >= 78) acc.highConfidence += 1;
      return acc;
    }, initial);
  }, [filtered]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">E</div>
          <div>
            <p className="brand-name">EVSCORE</p>
            <span className="brand-subtitle">Forecast Intelligence</span>
          </div>
        </div>

        <nav className="nav">
          <a href="#overview">Resumo</a>
          <a href="#fixtures">Jogos</a>
          <a href="#picks">Palpites</a>
        </nav>

        <button className="primary-btn">Ver palpite do dia</button>
      </header>

      <main className="content">
        <section className="hero" id="overview">
          <div className="hero-copy">
            <span className="eyebrow">Dados automáticos</span>
            <h1>Todos os jogos e palpites seguros em um só lugar.</h1>
            <p>
              A plataforma reúne partidas das principais ligas do mundo, margens de gols dos
              últimos 10 jogos e indica apostas com maior consistência com base em dados e
              tendências recentes.
            </p>

            <div className="hero-actions">
              <button className="primary-btn">Abrir painel</button>
              <button className="secondary-btn">Ver calendário</button>
            </div>

            <div className="mini-stats">
              <div className="mini-card green">
                <span>Jogos ativos</span>
                <strong>{metrics.total}</strong>
              </div>
              <div className="mini-card blue">
                <span>Palpites fortes</span>
                <strong>{metrics.highConfidence}</strong>
              </div>
              <div className="mini-card gold">
                <span>Margem média</span>
                <strong>+1.4</strong>
              </div>
              <div className="mini-card purple">
                <span>Confiança</span>
                <strong>81%</strong>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-header">
              <span className="status-live">• Atualizado agora</span>
              <span className="panel-tag">Todos os mercados</span>
            </div>

            <div className="featured-match">
              <div className="team-block">
                <div className="crest crest-1">M</div>
                <div>
                  <small>Casa</small>
                  <strong>{filtered[0]?.homeTeam ?? 'Manchester City'}</strong>
                </div>
              </div>

              <div className="score-block">
                <strong>{filtered[0]?.homeGoals ?? 2}</strong>
                <span>:</span>
                <strong>{filtered[0]?.awayGoals ?? 1}</strong>
              </div>

              <div className="team-block right">
                <div>
                  <small>Fora</small>
                  <strong>{filtered[0]?.awayTeam ?? 'Liverpool'}</strong>
                </div>
                <div className="crest crest-2">L</div>
              </div>
            </div>

            <div className="odds-grid">
              <div>
                <span>1</span>
                <strong>{filtered[0]?.odds.home ?? 1.9}</strong>
              </div>
              <div>
                <span>X</span>
                <strong>{filtered[0]?.odds.draw ?? 3.4}</strong>
              </div>
              <div>
                <span>2</span>
                <strong>{filtered[0]?.odds.away ?? 4.1}</strong>
              </div>
            </div>

            <div className="trend-box">
              <p>Palpite principal</p>
              <strong>{filtered[0]?.pick ?? 'Casa com mais de 1.5 gols'}</strong>
            </div>
          </div>
        </section>

        {error ? <div className="error-box">{error}</div> : null}
        {loading ? <div className="loading-shell">Carregando jogos e palpites…</div> : null}

        <section className="panel-section" id="fixtures">
          <div className="section-head">
            <div>
              <span className="eyebrow">Jogos em destaque</span>
              <h2>Partidas do dia e dos próximos 3 dias</h2>
            </div>
            <select value={league} onChange={(e) => setLeague(e.target.value)} className="league-filter">
              {leagues.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="fixture-list">
            {filtered.map((fixture) => (
              <article key={fixture.id} className="fixture-card">
                <div className="fixture-topline">
                  <span className="fixture-time">{formatDate(fixture.kickoff)}</span>
                  <span className="status-pill ao-vivo">{fixture.status}</span>
                </div>

                <div className="fixture-league">{fixture.league}</div>

                <div className="fixture-match">
                  <div className="team-line">
                    <strong>{fixture.homeTeam}</strong>
                    <span>{fixture.homeGoals ?? '—'}</span>
                  </div>
                  <div className="team-line">
                    <strong>{fixture.awayTeam}</strong>
                    <span>{fixture.awayGoals ?? '—'}</span>
                  </div>
                </div>

                <div className="odds-row">
                  <div>
                    <span>1</span>
                    <strong>{fixture.odds.home}</strong>
                  </div>
                  <div>
                    <span>X</span>
                    <strong>{fixture.odds.draw}</strong>
                  </div>
                  <div>
                    <span>2</span>
                    <strong>{fixture.odds.away}</strong>
                  </div>
                </div>

                <div className="fixture-details">
                  <div>
                    <span>Margem últimos 10</span>
                    <strong>{fixture.goalMarginLast10 > 0 ? '+' : ''}{fixture.goalMarginLast10}</strong>
                  </div>
                  <div>
                    <span>Confiança</span>
                    <strong>{fixture.confidence}%</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="insights-grid">
          <div className="analysis-box large">
            <div className="section-head">
              <div>
                <span className="eyebrow">Risco x retorno</span>
                <h3>Indicadores de produtividade</h3>
              </div>
            </div>

            <div className="chart-bars">
              <div className="bar-group">
                <span>Casa</span>
                <div className="bar" style={{ height: '68%' }} />
              </div>
              <div className="bar-group">
                <span>Emp.</span>
                <div className="bar" style={{ height: '34%' }} />
              </div>
              <div className="bar-group">
                <span>Fora</span>
                <div className="bar" style={{ height: '49%' }} />
              </div>
              <div className="bar-group">
                <span>Over</span>
                <div className="bar" style={{ height: '79%' }} />
              </div>
            </div>
          </div>

          <div className="analysis-box small">
            <div className="section-head">
              <div>
                <span className="eyebrow">Filtros</span>
                <h3>Modelagem</h3>
              </div>
            </div>

            <ul className="checklist">
              <li>Últimos 10 jogos por equipe</li>
              <li>Margem de gols e espaços defensivos</li>
              <li>Odds x expectativa real</li>
              <li>Lista de ligas principais do mundo</li>
            </ul>
          </div>
        </section>

        <section className="picks-section" id="picks">
          <div className="section-head">
            <div>
              <span className="eyebrow">Palpites seguros</span>
              <h2>Seleção com maior consistência</h2>
            </div>
            <a href="#">Ver tudo</a>
          </div>

          <div className="picks-grid">
            {filtered.slice(0, 3).map((pick) => (
              <article key={pick.id} className="pick-card">
                <span className="pick-badge">Top pick</span>
                <h3>{pick.pick}</h3>
                <p>
                  {pick.homeTeam} x {pick.awayTeam}
                </p>
                <div className="pick-footer">
                  <strong>{pick.odds.home}</strong>
                  <span>{pick.confidence}%</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
