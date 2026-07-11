import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { ASSISTANT_WELCOME, CRM_SESSION_KEY, getSessionId, getWhatsAppHref } from '../data/cosechaChat';

type ChatMsg = { id: string; role: 'user' | 'assistant'; text: string };

export type GeminiContactChatProps = {
  variant: 'embedded' | 'modal';
  open?: boolean;
  onClose?: () => void;
};

const CHAT_API = '/api/crm/chat';
const CHAT_SOURCE = 'web-widget';

const GeminiContactChat: React.FC<GeminiContactChatProps> = ({ variant, open = true, onClose }) => {
  const embedded = variant === 'embedded';
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const waHref = getWhatsAppHref('Chat web — Cosecha Creativa');

  const active = embedded || open;

  useEffect(() => {
    if (!active || embedded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [active, embedded, onClose]);

  useEffect(() => {
    if (!active) return;
    setMessages([{ id: 'welcome', role: 'assistant', text: ASSISTANT_WELCOME }]);
    setInput('');
    setError(null);
  }, [active]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;

    setInput('');
    setError(null);
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text }]);
    setTyping(true);

    try {
      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          message: text,
          source: CHAT_SOURCE,
        }),
      });
      const data = (await res.json()) as { reply?: string; sessionId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Error de red');

      if (data.sessionId) localStorage.setItem(CRM_SESSION_KEY, data.sessionId);

      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: 'assistant', text: data.reply ?? 'Sin respuesta.' },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'No se pudo enviar';
      setError(msg);
    } finally {
      setTyping(false);
    }
  }, [input, typing]);

  if (!active) return null;

  const panel = (
    <div
      className={`relative flex w-full flex-col overflow-hidden border border-white/15 bg-zinc-950 text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] ${
        embedded ? 'h-[min(420px,70vh)] rounded-2xl' : 'max-h-[min(92vh,720px)] rounded-2xl'
      }`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#eca8d6] to-[#a100f2] text-black">
            <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0">
            <p id="cosecha-crm-chat-title" className="font-display text-base text-white">
              Cosecha Creativa
            </p>
            <p className="text-xs text-white/45">IA · consultas y leads</p>
          </div>
        </div>
        {!embedded && onClose ? (
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                m.role === 'user'
                  ? 'rounded-br-md bg-[#eca8d6]/25 text-white'
                  : 'rounded-bl-md border border-white/10 bg-white/[0.06] text-white/90'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing ? <p className="text-xs text-white/40">Escribiendo…</p> : null}
        {error ? <p className="text-xs text-red-300">{error}</p> : null}
      </div>

      <div className="shrink-0 space-y-2 border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Escribí tu consulta…"
            disabled={typing}
            className="h-11 min-w-0 flex-1 rounded-md border border-white/15 bg-white/[0.06] px-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#eca8d6]/50 focus:ring-2 focus:ring-[#eca8d6]/20 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => void sendMessage()}
            disabled={typing || !input.trim()}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#eca8d6] text-black transition-colors hover:bg-[#f0b8e0] disabled:pointer-events-none disabled:opacity-40"
            aria-label="Enviar"
          >
            <Send className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs text-[#eca8d6]/90 hover:underline"
        >
          Preferís WhatsApp →
        </a>
      </div>
    </div>
  );

  if (embedded) return panel;

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cosecha-crm-chat-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#030406]/88 backdrop-blur-md"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
      <div className="relative z-[1] w-full max-w-lg">{panel}</div>
    </div>
  );
};

export default GeminiContactChat;
