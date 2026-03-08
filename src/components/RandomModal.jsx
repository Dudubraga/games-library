import { useState } from 'react';
import { PLATFORMS, STATUSES } from '../constants';

export default function RandomModal({ games, onClose }) {
  const [statusFilter, setStatusFilter] = useState(null);
  const [imgError, setImgError] = useState(false);

  const pool = statusFilter ? games.filter(g => g.status === statusFilter) : games;
  const pick = (p = pool) => p.length ? p[Math.floor(Math.random() * p.length)] : null;

  const [game, setGame] = useState(() => pick(pool));

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    setImgError(false);
    const newPool = val ? games.filter(g => g.status === val) : games;
    setGame(pick(newPool));
  };

  const handleAnother = () => {
    setImgError(false);
    setGame(pick());
  };

  if (!game) return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="random-popup">
        <div className="random-header"><h2>✨ Jogo do Momento</h2></div>
        <div className="roulette-status-filter">
          <button className={`sort-btn ${statusFilter === null ? 'active' : ''}`} onClick={() => handleStatusFilter(null)}>🎮 Todos</button>
          {STATUSES.map(s => (
            <button key={s.id} className={`sort-btn ${statusFilter === s.id ? 'active' : ''}`}
              style={statusFilter === s.id ? { background: `${s.color}20`, borderColor: s.color, color: s.color } : {}}
              onClick={() => handleStatusFilter(s.id)}>{s.ico} {s.label}</button>
          ))}
        </div>
        <div className="random-title" style={{ padding: '40px 0', color: 'var(--text3)' }}>
          Nenhum jogo nessa categoria
        </div>
        <div className="random-footer">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );

  const plat = PLATFORMS.find(p => p.id === game.platform);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="random-popup">
        <div className="random-header">
          <h2>✨ Jogo do Momento</h2>
        </div>

        <div className="roulette-status-filter">
          <button
            className={`sort-btn ${statusFilter === null ? 'active' : ''}`}
            onClick={() => handleStatusFilter(null)}
          >🎮 Todos</button>
          {STATUSES.map(s => (
            <button
              key={s.id}
              className={`sort-btn ${statusFilter === s.id ? 'active' : ''}`}
              style={statusFilter === s.id ? {
                background: `${s.color}20`,
                borderColor: s.color,
                color: s.color,
              } : {}}
              onClick={() => handleStatusFilter(s.id)}
            >{s.ico} {s.label}</button>
          ))}
        </div>

        <div className="random-poster">
          {!imgError && game.cover ? (
            <img src={game.cover} alt={game.title} onError={() => setImgError(true)} />
          ) : (
            <div className="random-poster-fallback">🎮</div>
          )}
        </div>

        <div className="random-title">{game.title}</div>

        <div className="random-meta">
          {plat && <span className="card-tag">{plat.ico} {plat.label}</span>}
          {(game.categories || []).map(c => (
            <span key={c} className="card-tag">{c}</span>
          ))}
        </div>

        <div className="random-footer">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Fechar</button>
          <button className="btn btn-gold btn-sm" onClick={handleAnother}>🎲 Outro</button>
        </div>
      </div>
    </div>
  );
}
