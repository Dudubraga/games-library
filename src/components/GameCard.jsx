import { useState } from 'react';
import { PLATFORMS, STATUSES } from '../constants';

export default function GameCard({ game, onEdit, onRemove }) {
  const [imgError, setImgError] = useState(false);
  const plat   = PLATFORMS.find(p => p.id === game.platform);
  const status = STATUSES.find(s => s.id === game.status);

  const posterStyle = status
    ? { boxShadow: `0 4px 20px rgba(0,0,0,.5), 0 0 0 2px ${status.color}55` }
    : {};

  return (
    <div className="card">
      <div className="card-poster" style={posterStyle}>
        {!imgError && game.cover ? (
          <img
            className="card-img"
            src={game.cover}
            alt={game.title}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-fallback">
            <span className="card-fallback-ico">🎮</span>
          </div>
        )}

        <div className="card-overlay">
          <div className="card-actions">
            <button
              className="card-action-btn edit"
              onClick={() => onEdit(game.id)}
              title="Editar"
            >✏️</button>
            <button
              className="card-action-btn del"
              onClick={() => onRemove(game.id)}
              title="Remover"
            >🗑</button>
          </div>
          {plat && (
            <span className="card-platform-badge">
              {plat.ico} {plat.label}
            </span>
          )}
        </div>

        {status && (
          <div
            className="card-status-badge"
            style={{ background: status.color }}
            title={status.label}
          >
            {status.ico}
          </div>
        )}
      </div>

      <div className="card-info">
        <p className="card-title">{game.title}</p>
        {game.categories?.length > 0 && (
          <div className="card-tags">
            {game.categories.map(c => (
              <span key={c} className="card-tag">{c}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
