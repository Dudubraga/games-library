import { useState, useMemo } from 'react';
import { PLATFORMS, STATUSES } from './constants';
import { useGames } from './hooks/useGames';
import GameGrid from './components/GameGrid';
import AddGameModal from './components/AddGameModal';
import RandomModal from './components/RandomModal';
import RouletteModal from './components/RouletteModal';
import ToastContainer, { toast } from './components/Toast';
import CategoryDropdown from './components/CategoryDropdown';
import ImportModal from './components/ImportModal';
import logoSvg from './assets/logo.svg';

const SORT_OPTIONS = [
  { id: 'recent',   label: '🕒 Recentes'      },
  { id: 'az',       label: 'A → Z'             },
  { id: 'za',       label: 'Z → A'             },
  { id: 'owned',    label: '✅ Temos primeiro' },
  { id: 'wishlist', label: '📅 Queremos primeiro' },
  { id: 'platform', label: '🎮 Plataforma'     },
];

export default function App() {
  const { games, loading, error, addGame, updateGame, removeGame } = useGames();

  const [search, setSearch]                 = useState('');
  const [filterPlatform, setFilterPlatform] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterStatus, setFilterStatus]     = useState(null);
  const [sortBy, setSortBy]                 = useState('recent');

  const [modal, setModal]             = useState(null);
  const [editingGame, setEditingGame] = useState(null);

  // ── Filter ────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = games.filter(g => {
      if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterPlatform && g.platform !== filterPlatform) return false;
      if (filterCategory && !(g.categories || []).includes(filterCategory)) return false;
      if (filterStatus && g.status !== filterStatus) return false;
      return true;
    });

    // ── Sort ────────────────────────────────────────
    const STATUS_ORDER = { owned: 0, wishlist: 1, null: 2, undefined: 2 };
    const PLAT_ORDER   = { steam: 0, epic: 1, web: 2, outro: 3 };

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'az':
          return a.title.localeCompare(b.title, 'pt-BR');
        case 'za':
          return b.title.localeCompare(a.title, 'pt-BR');
        case 'owned':
          return (STATUS_ORDER[a.status] ?? 2) - (STATUS_ORDER[b.status] ?? 2)
            || a.title.localeCompare(b.title, 'pt-BR');
        case 'wishlist':
          return (STATUS_ORDER[b.status] ?? 2) - (STATUS_ORDER[a.status] ?? 2)
            || a.title.localeCompare(b.title, 'pt-BR');
        case 'platform':
          return (PLAT_ORDER[a.platform] ?? 9) - (PLAT_ORDER[b.platform] ?? 9)
            || a.title.localeCompare(b.title, 'pt-BR');
        case 'recent':
        default:
          // Firestore returns newest first via orderBy createdAt desc
          return 0;
      }
    });

    return list;
  }, [games, search, filterPlatform, filterCategory, filterStatus, sortBy]);

  // ── Game ops ──────────────────────────────────────
  const handleSave = async (data) => {
    try {
      if (editingGame) {
        await updateGame(editingGame.id, data);
        toast('✅ Jogo atualizado!');
      } else {
        await addGame(data);
        toast('✅ Jogo adicionado!');
      }
      closeModal();
    } catch (e) {
      toast('❌ Erro ao salvar: ' + e.message);
    }
  };

  const handleBatchImport = async (gamesList) => {
    for (const game of gamesList) {
      await addGame(game);
    }
    toast(`✅ ${gamesList.length} jogos importados!`);
  };

  const handleEdit = (id) => {
    const g = games.find(x => x.id === id);
    if (!g) return;
    setEditingGame(g);
    setModal('edit');
  };

  const handleRemove = async (id) => {
    try {
      await removeGame(id);
      toast('🗑 Jogo removido');
    } catch (e) {
      toast('❌ Erro ao remover: ' + e.message);
    }
  };

  const openRandom = () => {
    if (!games.length) { toast('Nenhum jogo na biblioteca'); return; }
    setModal('random');
  };

  const openRoulette = () => {
    if (games.length < 2) { toast('Adicione pelo menos 2 jogos'); return; }
    setModal('roulette');
  };

  const closeModal = () => {
    setModal(null);
    setEditingGame(null);
  };

  return (
    <div className="app">

      {/* ═══ HEADER ═══════════════════════════════════ */}
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <div className="logo-mark">
              <img src={logoSvg} alt="4Teto logo" className="logo-img" />
            </div>
            <div>
              <div className="logo-text">4TETO</div>
              <div className="logo-sub">Games Library</div>
            </div>
          </div>

          <div className="header-search">
            <span className="search-ico">⌕</span>
            <input
              type="text"
              placeholder="Buscar jogo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="btn btn-ghost" onClick={() => setModal('import')}>
              📥 Importar
            </button>
            <button className="btn btn-gold" onClick={openRandom}>
              🎲 Aleatório
            </button>
            <button className="btn btn-orange" onClick={openRoulette}>
              🎡 Roleta
            </button>
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              ＋ Adicionar
            </button>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="filter-bar">
          <span className="filter-label">Plataforma</span>
          <div className="filter-group">
            <button
              className={`tag-btn ${filterPlatform === null ? 'active-platform' : ''}`}
              onClick={() => setFilterPlatform(null)}
            >Todos</button>
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                className={`tag-btn ${filterPlatform === p.id ? 'active-platform' : ''}`}
                onClick={() => setFilterPlatform(prev => prev === p.id ? null : p.id)}
              >
                {p.ico} {p.label}
              </button>
            ))}
          </div>

          <div className="filter-sep" />

          <span className="filter-label">Status</span>
          <div className="filter-group">
            <button
              className={`tag-btn ${filterStatus === null ? 'active-status' : ''}`}
              onClick={() => setFilterStatus(null)}
            >Todos</button>
            {STATUSES.map(s => (
              <button
                key={s.id}
                className={`tag-btn ${filterStatus === s.id ? 'active-status' : ''}`}
                style={filterStatus === s.id ? {
                  background: `${s.color}20`,
                  borderColor: s.color,
                  color: s.color,
                } : {}}
                onClick={() => setFilterStatus(prev => prev === s.id ? null : s.id)}
              >
                {s.ico} {s.label}
              </button>
            ))}
          </div>

          <div className="filter-sep" />

          <div className="filter-category-section">
            <span className="filter-label">Categoria</span>
            <CategoryDropdown
              value={filterCategory}
              onChange={setFilterCategory}
            />
          </div>
        </div>
      </header>

      {/* ═══ MAIN ════════════════════════════════════ */}
      <main className="main">

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Conectando à biblioteca...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <span>⚠️</span>
            <p>Erro ao carregar: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="stats-bar">
              <span className="stats-num">{filtered.length}</span>
              <span className="stats-lbl">&nbsp;jogos</span>
              <span className="live-badge">
                <span className="live-dot" />
                ao vivo
              </span>

              <div className="sort-group">
                <span className="sort-label">Ordenar</span>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    className={`sort-btn ${sortBy === opt.id ? 'active' : ''}`}
                    onClick={() => setSortBy(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <GameGrid
              games={filtered}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          </>
        )}
      </main>

      {/* ═══ MODALS ══════════════════════════════════ */}
      {(modal === 'add' || modal === 'edit') && (
        <AddGameModal
          editGame={editingGame}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {modal === 'random' && (
        <RandomModal
          games={filtered.length > 0 ? filtered : games}
          onClose={closeModal}
        />
      )}

      {modal === 'roulette' && (
        <RouletteModal
          games={games}
          onClose={closeModal}
        />
      )}

      {modal === 'import' && (
        <ImportModal
          onImport={handleBatchImport}
          onClose={closeModal}
        />
      )}

      <ToastContainer />
    </div>
  );
}
