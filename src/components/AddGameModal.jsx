import { useState, useEffect } from 'react';
import { PLATFORMS, ALL_CATEGORIES, STATUSES } from '../constants';

export default function AddGameModal({ editGame, onSave, onClose }) {
  const isEdit = !!editGame;

  const [title, setTitle]           = useState('');
  const [platform, setPlatform]     = useState('steam');
  const [categories, setCategories] = useState([]);
  const [cover, setCover]           = useState('');
  const [imgOk, setImgOk]           = useState(false);
  const [status, setStatus]         = useState(null); // null = not chosen yet

  // Populate fields when editing
  useEffect(() => {
    if (editGame) {
      setTitle(editGame.title || '');
      setPlatform(editGame.platform || 'steam');
      setCategories(editGame.categories || []);
      setCover(editGame.cover || '');
      setImgOk(!!editGame.cover);
      setStatus(editGame.status || null);
    }
  }, [editGame]);

  const toggleCategory = (c) => {
    setCategories(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), platform, categories, cover: cover.trim(), status });
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-hd">
          <h2>{isEdit ? 'EDITAR JOGO' : 'ADICIONAR JOGO'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Title */}
          <div className="fg">
            <label>Nome do Jogo *</label>

          {/* Status — always ask */}
          <div className="fg">
            <label>Status *</label>
            <div className="status-picker">
              {STATUSES.map(s => (
                <button
                  key={s.id}
                  className={`status-pick-btn ${status === s.id ? 'sel' : ''}`}
                  style={status === s.id ? {
                    background: `${s.color}20`,
                    borderColor: s.color,
                    color: s.color,
                  } : {}}
                  onClick={() => setStatus(s.id)}
                >
                  {s.ico} {s.label}
                </button>
              ))}
            </div>
          </div>
            <input
              type="text"
              placeholder="Ex: Among Us"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>

          {/* Platform */}
          <div className="fg">
            <label>Plataforma</label>
            <div className="platform-grid">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  className={`plat-btn ${platform === p.id ? 'sel' : ''}`}
                  onClick={() => setPlatform(p.id)}
                >
                  <span className="plat-ico">{p.ico}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="fg">
            <label>Categorias (pode selecionar várias)</label>
            <div className="cat-grid">
              {ALL_CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`cat-pick-btn ${categories.includes(c) ? 'sel' : ''}`}
                  onClick={() => toggleCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Cover URL */}
          <div className="fg">
            <label>URL da Capa</label>
            <div className="img-preview-row">
              <div className="img-preview-box">
                {cover && imgOk ? (
                  <img
                    src={cover}
                    alt="preview"
                    onError={() => setImgOk(false)}
                  />
                ) : (
                  '🎮'
                )}
              </div>
              <div className="img-url-col">
                <input
                  type="url"
                  placeholder="https://... (link da imagem)"
                  value={cover}
                  onChange={e => { setCover(e.target.value); setImgOk(true); }}
                />
                <p className="form-hint">
                  💡 Botão direito na imagem → "Copiar endereço da imagem"
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!title.trim()}
            >
              {isEdit ? 'Salvar Alterações' : 'Adicionar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
