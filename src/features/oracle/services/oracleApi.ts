import { aiStreamFetch } from '../../../shared/api/aiStreamFetch'

type StreamOracleChatParams = {
  message: string
  signal?: AbortSignal
  onChunk: (chunk: string) => void
}

export async function streamOracleChat({ message, signal, onChunk }: StreamOracleChatParams): Promise<void> {
  const response = await aiStreamFetch('/oracle/chat', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error(`Oracle indisponible (${response.status})`)
  }

  if (!response.body) {
    throw new Error('Flux Oracle indisponible.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      buffer = flushFrames(buffer, onChunk)
    }

    const tail = decoder.decode()
    if (tail) {
      buffer += tail
    }
    flushFrames(buffer, onChunk, true)
  } finally {
    reader.releaseLock()
  }
}

function flushFrames(buffer: string, onChunk: (chunk: string) => void, flushAll = false): string {
  const separator = '\n\n'
  let cursor = 0

  while (true) {
    const next = buffer.indexOf(separator, cursor)
    if (next === -1) {
      break
    }
    const frame = buffer.slice(cursor, next)
    pushFrame(frame, onChunk)
    cursor = next + separator.length
  }

  if (flushAll) {
    const rest = buffer.slice(cursor)
    if (/[^\r\n]/.test(rest)) {
      pushFrame(rest, onChunk)
    }
    return ''
  }

  return buffer.slice(cursor)
}

function pushFrame(frame: string, onChunk: (chunk: string) => void) {
  const normalizedFrame = frame.replace(/\r/g, '')
  if (!/[^\n]/.test(normalizedFrame)) {
    return
  }

  if (normalizedFrame.includes('data:')) {
    const lines = normalizedFrame
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      // SSE: retire seulement l'espace optionnel juste après "data:"
      .map((line) => (line.startsWith('data: ') ? line.slice(6) : line.slice(5)))

    const text = lines.join('\n')
    if (text.length > 0 && text !== '[DONE]') {
      onChunk(text)
    }
    return
  }

  onChunk(normalizedFrame)
}
