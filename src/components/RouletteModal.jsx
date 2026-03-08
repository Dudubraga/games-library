import { useState, useRef, useEffect, useCallback } from 'react';
import { WHEEL_COLORS } from '../constants';

const CANVAS_SIZE = 320;
const CX = CANVAS_SIZE / 2;
const CY = CANVAS_SIZE / 2;
const RADIUS = 148;

function drawWheel(canvas, items, angle) {
  if (!canvas || !items.length) return;
  const ctx = canvas.getContext('2d');
  const n = items.length;
  const arc = (2 * Math.PI) / n;

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  items.forEach((item, i) => {
    const start = angle + i * arc - Math.PI / 2;
    const end = start + arc;

    // Slice
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, RADIUS, start, end);
    ctx.closePath();
    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    const fontSize = Math.max(9, Math.min(13, (RADIUS * 0.9) / n * 1.6));
    ctx.font = `600 ${fontSize}px Outfit, sans-serif`;
    const label = item.title.length > 14 ? item.title.slice(0, 13) + '…' : item.title;
    ctx.fillText(label, RADIUS - 10, fontSize / 3);
    ctx.restore();
  });

  // Center cap
  ctx.beginPath();
  ctx.arc(CX, CY, 22, 0, 2 * Math.PI);
  ctx.fillStyle = '#0d1117';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export default function RouletteModal({ games, onClose }) {
  const [step, setStep] = useState('pick'); // 'pick' | 'spin'
  const [picked, setPicked] = useState(new Set());
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef = useRef(null);

  const wheelItems = games.filter(g => picked.has(g.id));

  // Draw whenever items or step changes
  useEffect(() => {
    if (step === 'spin' && canvasRef.current) {
      drawWheel(canvasRef.current, wheelItems, angleRef.current);
    }
  }, [step, picked]);

  const togglePick = (id) => {
    setPicked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const pickAll  = () => setPicked(new Set(games.map(g => g.id)));
  const pickNone = () => setPicked(new Set());
  const pick5    = () => {
    const shuffled = [...games].sort(() => Math.random() - 0.5).slice(0, Math.min(5, games.length));
    setPicked(new Set(shuffled.map(g => g.id)));
  };

  const startSpin = () => {
    if (wheelItems.length < 2) return;
    setStep('spin');
    setResult(null);
    angleRef.current = 0;
  };

  const spin = useCallback(() => {
    if (spinning || !wheelItems.length) return;
    setSpinning(true);
    setResult(null);

    const winnerIdx = Math.floor(Math.random() * wheelItems.length);
    const arc = (2 * Math.PI) / wheelItems.length;
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    // Put winner under pointer (pointer is at right = 0 rad from center)
    const targetOffset = -(winnerIdx * arc + arc / 2) + Math.PI / 2;
    const currentNorm = ((angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const targetNorm  = ((targetOffset % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let delta = targetNorm - currentNorm;
    if (delta <= 0) delta += 2 * Math.PI;
    const totalRot = extraSpins * 2 * Math.PI + delta;

    const duration = 4200;
    const startTime = performance.now();
    const startAngle = angleRef.current;

    const frame = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      angleRef.current = startAngle + totalRot * ease;
      drawWheel(canvasRef.current, wheelItems, angleRef.current);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setSpinning(false);
        setResult(wheelItems[winnerIdx]);
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [spinning, wheelItems]);

  // Cleanup on unmount
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handleClose = () => {
    cancelAnimationFrame(rafRef.current);
    onClose();
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="roulette-popup">
        <div className="roulette-header">
          <h2>🎡 Roleta de Jogos</h2>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>

        {/* ── STEP 1: PICK ── */}
        {step === 'pick' && (
          <>
            <div className="roulette-picker">
              <p>Selecione os jogos para entrar na roleta (<strong>{picked.size}</strong> selecionados):</p>
              <div className="pick-grid">
                {games.map(g => (
                  <div
                    key={g.id}
                    className={`pick-item ${picked.has(g.id) ? 'picked' : ''}`}
                    onClick={() => togglePick(g.id)}
                  >
                    <div className="pick-thumb">
                      {g.cover
                        ? <img src={g.cover} alt="" onError={e => e.target.style.display='none'} />
                        : '🎮'}
                    </div>
                    <span className="pick-name">{g.title}</span>
                  </div>
                ))}
              </div>
              <div className="pick-controls">
                <button className="btn btn-ghost btn-sm" onClick={pickAll}>Todos</button>
                <button className="btn btn-ghost btn-sm" onClick={pickNone}>Nenhum</button>
                <button className="btn btn-ghost btn-sm" onClick={pick5}>5 aleatórios</button>
              </div>
            </div>
            <div className="wheel-footer">
              <button className="btn btn-ghost btn-sm" onClick={handleClose}>Cancelar</button>
              <button
                className="btn btn-orange"
                onClick={startSpin}
                disabled={wheelItems.length < 2}
              >
                🎡 Girar Roleta
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: SPIN ── */}
        {step === 'spin' && (
          <>
            <div className="wheel-area">
              <div className="wheel-wrap">
                <div className="wheel-pointer" />
                <canvas
                  ref={canvasRef}
                  className="wheel-canvas"
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                />
              </div>
            </div>

            {result && (
              <div className="wheel-result">
                <div className="wheel-result-label">🏆 SELECIONADO</div>
                <div className="wheel-result-title">{result.title}</div>
              </div>
            )}

            <div className="wheel-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => { setStep('pick'); setResult(null); }}>
                ← Voltar
              </button>
              <button
                className="btn btn-orange btn-sm"
                onClick={spin}
                disabled={spinning}
              >
                {spinning ? '⏳ Girando…' : '🎡 Girar'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleClose}>Fechar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
