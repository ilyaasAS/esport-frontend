import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { streamOracleChat } from '../services/oracleApi'

type OracleChatRole = 'user' | 'oracle'

export type OracleChatMessage = {
  id: string
  role: OracleChatRole
  content: string
}

type UseOracleChatResult = {
  messages: OracleChatMessage[]
  composer: string
  setComposer: (value: string) => void
  isStreaming: boolean
  error: string | null
  submitMessage: () => Promise<void>
  stopStreaming: () => void
}

export function useOracleChat(): UseOracleChatResult {
  const [messages, setMessages] = useState<OracleChatMessage[]>([])
  const [composer, setComposer] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const queueRef = useRef<string[]>([])
  const pumpingRef = useRef(false)
  const lastOracleIdRef = useRef<string | null>(null)

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    queueRef.current = []
    pumpingRef.current = false
    setIsStreaming(false)
  }, [])

  useEffect(() => () => stopStreaming(), [stopStreaming])

  const appendOracleWords = useCallback(() => {
    if (pumpingRef.current) {
      return
    }
    pumpingRef.current = true

    const tick = () => {
      const nextWord = queueRef.current.shift()
      if (!nextWord) {
        pumpingRef.current = false
        return
      }

      const oracleId = lastOracleIdRef.current
      if (!oracleId) {
        pumpingRef.current = false
        return
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === oracleId
            ? {
                ...message,
                content: message.content.length === 0 ? nextWord : `${message.content} ${nextWord}`,
              }
            : message,
        ),
      )

      window.setTimeout(tick, 35)
    }

    tick()
  }, [])

  const submitMessage = useCallback(async () => {
    if (isStreaming) {
      return
    }

    const content = composer.trim()
    if (!content) {
      return
    }

    const userId = crypto.randomUUID()
    const oracleId = crypto.randomUUID()
    lastOracleIdRef.current = oracleId
    setError(null)
    setComposer('')
    setIsStreaming(true)
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', content },
      { id: oracleId, role: 'oracle', content: '' },
    ])

    const controller = new AbortController()
    abortRef.current = controller
    queueRef.current = []

    try {
      await streamOracleChat({
        message: content,
        signal: controller.signal,
        onChunk: (chunk) => {
          const words = chunk
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(Boolean)
          queueRef.current.push(...words)
          appendOracleWords()
        },
      })
    } catch (err) {
      if (controller.signal.aborted) {
        return
      }
      setError(err instanceof Error ? err.message : "L'Oracle est momentanément indisponible.")
      if (lastOracleIdRef.current) {
        setMessages((current) =>
          current.map((message) =>
            message.id === lastOracleIdRef.current
              ? {
                  ...message,
                  content:
                    message.content || "Je n'ai pas pu répondre. Vérifie l'authentification et l'état du backend Oracle.",
                }
              : message,
          ),
        )
      }
    } finally {
      abortRef.current = null
      setIsStreaming(false)
    }
  }, [appendOracleWords, composer, isStreaming])

  return useMemo(
    () => ({
      messages,
      composer,
      setComposer,
      isStreaming,
      error,
      submitMessage,
      stopStreaming,
    }),
    [messages, composer, isStreaming, error, submitMessage, stopStreaming],
  )
}
