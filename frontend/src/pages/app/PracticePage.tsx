// SIGNAVERSE — Practice Hub Page
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, BluetoothOff, Zap, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { deviceService } from '../../services/device';
import { useDeviceStore } from '../../store/deviceStore';
import { useGamification } from '../../hooks/useGamification';
import { practiceApi } from '../../services/api/practiceApi';
import { fadeUp, scaleIn, staggerContainer } from '../../utils/motion';

type RecognitionState = 'idle' | 'listening' | 'processing' | 'success' | 'retry';

const TARGET_SIGNS = [
  { id: 'sign-namaste', word: 'Namaste', hint: 'Bring both palms together at chest level' },
  { id: 'sign-thankyou', word: 'Thank You', hint: 'Touch fingertips to chin and extend outward' },
  { id: 'sign-water', word: 'Water', hint: 'Form a W with three fingers and tap chin twice' },
  { id: 'sign-help', word: 'Help', hint: 'Fist on palm, lift upward together' },
  { id: 'sign-good', word: 'Good', hint: 'Touch fingertips to chin, move hand forward and down' },
];

export function PracticePage() {
  const { status, batteryLevel } = useDeviceStore();
  const { submitResult } = useGamification();
  const [currentSignIdx, setCurrentSignIdx] = useState(0);
  const [recogState, setRecogState] = useState<RecognitionState>('idle');
  const [confidence, setConfidence] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const currentSign = TARGET_SIGNS[currentSignIdx];

  async function handleConnect() {
    setIsConnecting(true);
    try {
      await deviceService.connect();
      const sess = await practiceApi.startSession('practice-free');
      setSessionId(sess.sessionId);
    } catch (_) {}
    setIsConnecting(false);
  }

  async function handleDisconnect() {
    await deviceService.disconnect();
    setRecogState('idle');
    setSessionId(null);
  }

  async function handlePerformSign() {
    if (status !== 'connected') return;
    setRecogState('listening');
    await new Promise(r => setTimeout(r, 800));
    setRecogState('processing');
    await new Promise(r => setTimeout(r, 900));
    const mockConfidence = 0.78 + Math.random() * 0.18;
    setConfidence(mockConfidence);
    setRecogState(mockConfidence >= 0.75 ? 'success' : 'retry');
    if (mockConfidence >= 0.75 && sessionId) {
      await submitResult({ sessionId, signId: currentSign.id, confidence: mockConfidence, correct: true });
    }
  }

  function handleNext() {
    setCurrentSignIdx(i => (i + 1) % TARGET_SIGNS.length);
    setRecogState('idle');
    setConfidence(0);
  }

  function handleRetry() {
    setRecogState('idle');
    setConfidence(0);
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="px-6 pt-8 pb-6 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl bg-aqua pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-2xl mx-auto">
          <p className="text-muted text-sm font-display font-700 mb-1">AI-Powered</p>
          <h1 className="font-display font-900 text-display-md text-text">🤖 Practice</h1>
          <p className="text-muted text-sm mt-2">Connect your smart glove and practice signs with AI feedback</p>
        </motion.div>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-5">
        {/* Device Status */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'connected' ? 'bg-success/15' : status === 'connecting' ? 'bg-warning/15' : 'bg-white/5'}`}>
                {status === 'connected' ? <Bluetooth size={20} className="text-success" /> : status === 'connecting' ? <Loader2 size={20} className="text-warning animate-spin" /> : <BluetoothOff size={20} className="text-subtle" />}
              </div>
              <div>
                <p className="font-display font-700 text-sm text-text">SignaVerse Glove</p>
                <p className={`text-xs capitalize ${status === 'connected' ? 'text-success' : status === 'error' ? 'text-error' : 'text-subtle'}`}>
                  {status === 'connected' ? `Connected · ${batteryLevel}% battery` : status === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </p>
              </div>
            </div>
            {status === 'connected' ? (
              <button onClick={handleDisconnect} className="btn-ghost py-2 px-4 text-xs">Disconnect</button>
            ) : (
              <button onClick={handleConnect} disabled={isConnecting} className="btn-primary py-2 px-4 text-xs">
                {isConnecting ? <><Loader2 size={14} className="animate-spin" />Pairing...</> : <><Bluetooth size={14} />Connect</>}
              </button>
            )}
          </div>
          <div className="mt-3 p-3 rounded-xl text-xs text-subtle" style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.1)' }}>
            ⚠️ <span className="font-700">Mock device</span> — Real ESP32 smart glove integration pending. AI recognition is deterministic simulation.
          </div>
        </motion.div>

        {/* Target Sign */}
        <motion.div variants={scaleIn} initial="hidden" animate="visible" className="card-elevated p-8 text-center">
          <p className="text-muted text-xs font-display font-700 mb-4 uppercase tracking-widest">Target Sign</p>
          <motion.div className="text-8xl mb-4 select-none" animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>🤟</motion.div>
          <h2 className="font-display font-900 text-4xl text-gradient-primary mb-2">{currentSign.word}</h2>
          <p className="text-muted text-sm max-w-xs mx-auto leading-relaxed">{currentSign.hint}</p>
        </motion.div>

        {/* Recognition State */}
        <AnimatePresence mode="wait">
          {recogState === 'idle' && (
            <motion.div key="idle" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-3">
              <p className="text-center text-muted text-sm">
                {status === 'connected' ? 'Ready to recognize your sign' : 'Connect your glove to start practicing'}
              </p>
              <button onClick={handlePerformSign} disabled={status !== 'connected'} className="btn-primary w-full py-4 text-base disabled:opacity-40">
                <Zap size={20} />Perform Sign
              </button>
            </motion.div>
          )}

          {(recogState === 'listening' || recogState === 'processing') && (
            <motion.div key="processing" variants={scaleIn} initial="hidden" animate="visible" className="card p-6 text-center">
              <Loader2 size={32} className="text-secondary animate-spin mx-auto mb-3" />
              <p className="font-display font-700 text-text">{recogState === 'listening' ? 'Capturing gesture...' : 'AI analyzing...'}</p>
              <p className="text-muted text-sm mt-1">{recogState === 'listening' ? 'Hold your sign steady' : 'Processing sensor data'}</p>
            </motion.div>
          )}

          {recogState === 'success' && (
            <motion.div key="success" variants={scaleIn} initial="hidden" animate="visible" className="card p-6 text-center" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
              <CheckCircle size={40} className="text-success mx-auto mb-3" />
              <p className="font-display font-900 text-xl text-success mb-1">Excellent!</p>
              <p className="text-muted text-sm mb-4">{Math.round(confidence * 100)}% confidence</p>
              <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <motion.div className="h-full rounded-full bg-success" initial={{ width: 0 }} animate={{ width: `${confidence * 100}%` }} transition={{ duration: 1 }} />
              </div>
              <button onClick={handleNext} className="btn-primary w-full py-3">Next Sign →</button>
            </motion.div>
          )}

          {recogState === 'retry' && (
            <motion.div key="retry" variants={scaleIn} initial="hidden" animate="visible" className="card p-6 text-center" style={{ borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)' }}>
              <AlertCircle size={40} className="text-error mx-auto mb-3" />
              <p className="font-display font-900 text-xl text-error mb-1">Keep Practicing</p>
              <p className="text-muted text-sm mb-4">{Math.round(confidence * 100)}% confidence — need 75%+</p>
              <button onClick={handleRetry} className="btn-ghost w-full py-3"><RefreshCw size={16} />Try Again</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign list */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <h3 className="font-display font-700 text-text mb-3">Practice Queue</h3>
          <div className="space-y-2">
            {TARGET_SIGNS.map((sign, i) => (
              <motion.button key={sign.id} variants={fadeUp} onClick={() => { setCurrentSignIdx(i); setRecogState('idle'); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${i === currentSignIdx ? 'bg-primary-light/15 border border-primary-light/30' : 'hover:bg-white/5 card'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-display font-900 ${i === currentSignIdx ? 'bg-primary-light text-white' : 'bg-white/5 text-subtle'}`}>{i + 1}</div>
                <div className="flex-1"><p className="font-display font-700 text-sm text-text">{sign.word}</p><p className="text-subtle text-xs">{sign.hint}</p></div>
                {i < currentSignIdx && <CheckCircle size={16} className="text-success" />}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
