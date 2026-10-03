import { useState, useEffect } from 'react'

// Generic cross-feature hook, kept in src/hooks (as opposed to a
// feature-local hook in src/features/*/hooks). Not wired up yet, but ready
// for e.g. persisting theme preference or chat drafts.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore write errors (e.g. private browsing)
    }
  }, [key, value])

  return [value, setValue]
}
