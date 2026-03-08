import GameCard from './GameCard';

export default function GameGrid({ games, onEdit, onRemove }) {
  if (games.length === 0) {
    return (
      <div className="empty">
        <span className="empty-ico">🎮</span>
        <p className="empty-title">Nenhum jogo aqui</p>
        <p className="empty-sub">Adicione um jogo ou mude os filtros</p>
      </div>
    );
  }

  return (
    <div className="game-grid">
      {games.map(game => (
        <GameCard
          key={game.id}
          game={game}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
