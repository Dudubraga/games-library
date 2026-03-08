import { useState } from 'react';
import { PLATFORMS } from '../constants';

export default function RandomModal({ games, onClose }) {
  const pick = () => games[Math.floor(Math.random() * games.length)];
  const [game, setGame] = useState(() => pick());
  const [imgError, setImgError] = useState(false);

  const handleAnother = () => {
    setImgError(false);
    setGame(pick());
  };

  const plat = PLATFORMS.find(p => p.id === game.platform);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="random-popup">
        <div className="random-header">
          <h2>✨ Jogo do Momento</h2>
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
