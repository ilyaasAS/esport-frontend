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
  const rafRef = useRef<number | null>(null)
  const lastOracleIdRef = useRef<string | null>(null)
  const BATCH_SIZE = 8

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    queueRef.current = []
    pumpingRef.current = false
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setIsStreaming(false)
  }, [])

  useEffect(() => () => stopStreaming(), [stopStreaming])

  const appendOracleWords = useCallback(() => {
    if (pumpingRef.current) {
      return
    }
    pumpingRef.current = true

    const tick = () => {
      if (queueRef.current.length === 0) {
        pumpingRef.current = false
        rafRef.current = null
        return
      }

      const oracleId = lastOracleIdRef.current
      if (!oracleId) {
        pumpingRef.current = false
        rafRef.current = null
        return
      }

      const nextChunks = queueRef.current.splice(0, BATCH_SIZE)
      const mergedChunk = nextChunks.join('')

      setMessages((current) =>
        {
          const oracleIndex = current.findIndex((message) => message.id === oracleId)
          if (oracleIndex === -1) {
            return current
          }

          const oracleMessage = current[oracleIndex]
          const nextContent = `${oracleMessage.content}${mergedChunk}`

          const updated = [...current]
          updated[oracleIndex] = { ...oracleMessage, content: nextContent }
          return updated
        },
      )

      rafRef.current = window.requestAnimationFrame(tick)
    }

    rafRef.current = window.requestAnimationFrame(tick)
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
          queueRef.current.push(chunk)
          appendOracleWords()
        },
      })
    } catch (err) {
      if (controller.signal.aborted) {
        return
      }
      setError(err instanceof Error ? err.message : "L'Oracle est momentanément indisponible.")
      if (lastOracleIdRef.current) {
        setMessages((current) => {
          const oracleIndex = current.findIndex((message) => message.id === lastOracleIdRef.current)
          if (oracleIndex === -1) {
            return current
          }
          const oracleMessage = current[oracleIndex]
          const updated = [...current]
          updated[oracleIndex] = {
            ...oracleMessage,
            content:
              oracleMessage.content || "Je n'ai pas pu répondre. Vérifie l'authentification et l'état du backend Oracle.",
          }
          return updated
        })
      }
    } finally {
      abortRef.current = null
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
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
