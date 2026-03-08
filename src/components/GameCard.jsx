import { useState } from 'react';
import { PLATFORMS } from '../constants';

export default function GameCard({ game, onEdit, onRemove }) {
  const [imgError, setImgError] = useState(false);
  const plat = PLATFORMS.find(p => p.id === game.platform);

  return (
    <div className="card">
      <div className="card-poster">
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
