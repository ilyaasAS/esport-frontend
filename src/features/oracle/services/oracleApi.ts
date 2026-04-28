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
    if (rest.trim().length > 0) {
      pushFrame(rest, onChunk)
    }
    return ''
  }

  return buffer.slice(cursor)
}

function pushFrame(frame: string, onChunk: (chunk: string) => void) {
  const trimmed = frame.trim()
  if (!trimmed) {
    return
  }

  if (trimmed.includes('data:')) {
    const lines = trimmed
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())

    const text = lines.join('\n')
    if (text.length > 0 && text !== '[DONE]') {
      onChunk(text)
    }
    return
  }

  onChunk(trimmed)
}
