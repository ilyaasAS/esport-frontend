import { Crown, Send, Square, Sparkles } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import { cn } from '../../../shared/lib/cn'
import { useOracleChat } from '../hooks/useOracleChat'

export function OracleChatPanel() {
  const { messages, composer, setComposer, isStreaming, error, submitMessage, stopStreaming } = useOracleChat()

  const handleSubmit = async () => {
    await submitMessage()
  }

  const onComposerKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await handleSubmit()
    }
  }

  return (
    <section className="flex h-full flex-col bg-arena-950/80">
      <header className="border-b border-slate-800/90 bg-arena-900/95 px-4 py-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-neon-400/25 blur" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-neon-400/70 bg-gradient-to-br from-neon-400/30 to-sky-400/20">
              <Crown className="h-8 w-8 text-neon-300" />
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
              Oracle du Patriarche
              <Sparkles className="h-4 w-4 text-neon-300" />
            </h2>
            <p className="text-xs text-slate-400">Analyse stratégique. Réponses brèves. Exécution assistée par outils.</p>
          </div>
        </div>
      </header>

      <div
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={isStreaming}
      >
        {messages.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-arena-900/80 p-3 text-sm text-slate-300">
            Décris un objectif de ligue (classement, match, performance). L&apos;Oracle agit en temps réel.
          </div>
        ) : null}

        {messages.map((message) => (
          <article
            key={message.id}
            className={cn(
              'rounded-xl border px-3 py-2 text-sm leading-relaxed',
              message.role === 'user'
                ? 'ml-6 border-sky-400/30 bg-sky-400/10 text-slate-100'
                : 'mr-2 border-neon-400/25 bg-arena-900/95 text-slate-200',
            )}
          >
            <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">{message.role === 'user' ? 'Patriarche' : 'Oracle'}</p>
            <p className={cn('whitespace-pre-wrap', message.role === 'oracle' && isStreaming ? 'animate-pulse' : '')}>
              {message.content || (message.role === 'oracle' && isStreaming ? '...' : '')}
            </p>
          </article>
        ))}
      </div>

      <footer className="space-y-2 border-t border-slate-800/90 bg-arena-900/95 p-4">
        {error ? (
          <p
            className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
            aria-live="assertive"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <div className="flex items-end gap-2">
          <textarea
            value={composer}
            onChange={(event) => setComposer(event.target.value)}
            onKeyDown={onComposerKeyDown}
            rows={3}
            aria-label="Message à envoyer à l'Oracle"
            placeholder="Ex: Enregistre un match Shadow 10 - Test 7"
            className="min-h-[76px] flex-1 resize-none rounded-lg border border-slate-700 bg-arena-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-400"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-red-400/50 bg-red-500/10 px-3 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              <Square className="h-3.5 w-3.5" />
              Arrêter
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!composer.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-neon-400 px-3 text-xs font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" />
              Envoyer
            </button>
          )}
        </div>
      </footer>
    </section>
  )
}
