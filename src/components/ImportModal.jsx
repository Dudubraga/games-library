import { useState } from 'react';
import { PLATFORMS, ALL_CATEGORIES } from '../constants';

const EXAMPLE = JSON.stringify([
  {
    "title": "Among Us",
    "platform": "steam",
    "categories": ["Party Games", "Coop"],
    "cover": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/945360/library_600x900.jpg",
    "status": "owned"
  },
  {
    "title": "Jackbox Party Pack",
    "platform": "steam",
    "categories": ["Party Games"],
    "cover": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/331670/library_600x900.jpg",
    "status": "wishlist"
  }
], null, 2);

const VALID_PLATFORMS = PLATFORMS.map(p => p.id);

function validateGames(parsed) {
  const errors = [];
  const valid  = [];

  parsed.forEach((item, i) => {
    const row = i + 1;
    if (!item.title || typeof item.title !== 'string') {
      errors.push(`Jogo ${row}: campo "title" ausente ou inválido`);
      return;
    }
    if (item.platform && !VALID_PLATFORMS.includes(item.platform)) {
      errors.push(`Jogo ${row} ("${item.title}"): plataforma "${item.platform}" inválida. Use: ${VALID_PLATFORMS.join(', ')}`);
      return;
    }
    if (item.categories && !Array.isArray(item.categories)) {
      errors.push(`Jogo ${row} ("${item.title}"): "categories" deve ser um array`);
      return;
    }
    valid.push({
      title:      item.title.trim(),
      platform:   item.platform   || 'outro',
      categories: Array.isArray(item.categories)
        ? item.categories.filter(c => ALL_CATEGORIES.includes(c))
        : [],
      cover:      item.cover?.trim() || '',
      status:     ['owned','wishlist'].includes(item.status) ? item.status : null,
    });
  });

  return { valid, errors };
}

export default function ImportModal({ onImport, onClose }) {
  const [raw, setRaw]         = useState('');
  const [errors, setErrors]   = useState([]);
  const [preview, setPreview] = useState(null);
  const [step, setStep]       = useState('edit'); // 'edit' | 'preview' | 'done'
  const [imported, setImported] = useState(0);

  const handleParse = () => {
    setErrors([]);
    setPreview(null);

    let parsed;
    try {
      parsed = JSON.parse(raw.trim());
    } catch (e) {
      setErrors([`JSON inválido: ${e.message}`]);
      return;
    }

    if (!Array.isArray(parsed)) {
      setErrors(['O JSON deve ser um array [ { ... }, { ... } ]']);
      return;
    }

    const { valid, errors: errs } = validateGames(parsed);

    if (errs.length) {
      setErrors(errs);
      return;
    }

    setPreview(valid);
    setStep('preview');
  };

  const handleImport = async () => {
    try {
      await onImport(preview);
      setImported(preview.length);
      setStep('done');
    } catch (e) {
      setErrors([`Erro ao importar: ${e.message}`]);
      setStep('preview');
    }
  };

  const handleLoadExample = () => {
    setRaw(EXAMPLE);
    setErrors([]);
    setPreview(null);
    setStep('edit');
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal import-modal">

        <div className="modal-hd">
          <h2>IMPORTAR EM LOTE</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* ── STEP: EDIT ── */}
          {step === 'edit' && (
            <>
              <div className="import-intro">
                <p>Cole um array JSON com os jogos. Cada item deve ter:</p>
                <div className="import-fields">
                  <span className="import-field required">title <em>*obrigatório</em></span>
                  <span className="import-field">platform <em>steam | epic | web | outro</em></span>
                  <span className="import-field">categories <em>array de strings</em></span>
                  <span className="import-field">cover <em>URL da imagem</em></span>
                  <span className="import-field">status <em>owned | wishlist</em></span>
                </div>
              </div>

              <div className="fg">
                <div className="import-label-row">
                  <label>JSON</label>
                  <button className="btn-link" onClick={handleLoadExample}>
                    carregar exemplo
                  </button>
                </div>
                <textarea
                  className="import-textarea"
                  value={raw}
                  onChange={e => { setRaw(e.target.value); setErrors([]); }}
                  placeholder={'[\n  {\n    "title": "Nome do Jogo",\n    "platform": "steam",\n    "categories": ["Party Games"],\n    "cover": "https://..."\n  }\n]'}
                  spellCheck={false}
                />
              </div>

              {errors.length > 0 && (
                <div className="import-errors">
                  {errors.map((e, i) => (
                    <p key={i} className="import-error">⚠ {e}</p>
                  ))}
                </div>
              )}

              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                <button
                  className="btn btn-primary"
                  onClick={handleParse}
                  disabled={!raw.trim()}
                >
                  Validar →
                </button>
              </div>
            </>
          )}

          {/* ── STEP: PREVIEW ── */}
          {step === 'preview' && preview && (
            <>
              <div className="import-preview-header">
                <span className="import-count">{preview.length} jogos prontos para importar</span>
              </div>

              <div className="import-preview-list">
                {preview.map((g, i) => {
                  const plat = PLATFORMS.find(p => p.id === g.platform);
                  return (
                    <div key={i} className="import-preview-item">
                      <div className="import-preview-thumb">
                        {g.cover
                          ? <img src={g.cover} alt="" onError={e => e.target.style.display='none'} />
                          : '🎮'}
                      </div>
                      <div className="import-preview-info">
                        <p className="import-preview-title">{g.title}</p>
                        <p className="import-preview-meta">
                          {plat ? `${plat.ico} ${plat.label}` : ''}
                          {g.categories.length > 0 && ` · ${g.categories.join(', ')}`}
                        </p>
                      </div>
                      <span className="import-preview-ok">✓</span>
                    </div>
                  );
                })}
              </div>

              {errors.length > 0 && (
                <div className="import-errors">
                  {errors.map((e, i) => <p key={i} className="import-error">⚠ {e}</p>)}
                </div>
              )}

              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setStep('edit')}>← Editar</button>
                <button className="btn btn-primary" onClick={handleImport}>
                  ✅ Importar {preview.length} jogos
                </button>
              </div>
            </>
          )}

          {/* ── STEP: DONE ── */}
          {step === 'done' && (
            <div className="import-done">
              <span className="import-done-ico">🎉</span>
              <p className="import-done-title">{imported} jogos importados!</p>
              <p className="import-done-sub">Já estão disponíveis para todos na biblioteca.</p>
              <button className="btn btn-primary" onClick={onClose}>Fechar</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
