import { useState } from 'react'

import { RetrospectivePlayerScreen } from './components/RetrospectivePlayerScreen'
import {
  retrospectiveData,
  type RetrospectiveData,
  type RetrospectiveMemory,
} from './data/retrospective'
import { CreateRetrospectiveScreen } from './pages/CreateRetrospectiveScreen'
import { StartScreen } from './components/StartScreen'

const STORAGE_KEY = 'retrospective_data'

type AppScreen = 'start' | 'create' | 'retrospective'

type AppState = {
  screen: AppScreen
  data: RetrospectiveData | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getStoredString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback

const normalizeStoredMemories = (value: unknown): RetrospectiveMemory[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return retrospectiveData.memories
  }

  return value.slice(0, 6).map((memory, index) => {
    if (!isRecord(memory)) {
      return { id: index + 1 }
    }

    return {
      id: typeof memory.id === 'number' ? memory.id : index + 1,
      title: typeof memory.title === 'string' ? memory.title : undefined,
      caption: typeof memory.caption === 'string' ? memory.caption : undefined,
    }
  })
}

const normalizeStoredLyrics = (value: unknown) => {
  if (!Array.isArray(value)) {
    return retrospectiveData.lyrics
  }

  const lyrics = value
    .filter((line): line is string => typeof line === 'string')
    .map((line) => line.trim())
    .filter(Boolean)

  return lyrics.length > 0 ? lyrics : retrospectiveData.lyrics
}

const normalizeStoredRetrospectiveData = (
  value: unknown,
): RetrospectiveData | null => {
  if (!isRecord(value)) {
    return null
  }

  return {
    coupleName: getStoredString(value.coupleName, retrospectiveData.coupleName),
    retrospectiveTitle: getStoredString(
      value.retrospectiveTitle,
      retrospectiveData.retrospectiveTitle,
    ),
    subtitle: getStoredString(value.subtitle, retrospectiveData.subtitle),
    songTitle: getStoredString(value.songTitle, retrospectiveData.songTitle),
    artistName: getStoredString(value.artistName, retrospectiveData.artistName),
    audioUrl: getStoredString(value.audioUrl, retrospectiveData.audioUrl),
    startDate: getStoredString(value.startDate, retrospectiveData.startDate),
    lyrics: normalizeStoredLyrics(value.lyrics),
    memories: normalizeStoredMemories(value.memories),
  }
}

const loadSavedRetrospectiveData = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY)

    if (!savedData) {
      return null
    }

    return normalizeStoredRetrospectiveData(JSON.parse(savedData))
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const prepareRetrospectiveDataForStorage = (
  data: RetrospectiveData,
): RetrospectiveData => ({
  ...data,
  // Blob preview URLs are session-only, so localStorage keeps only text and memory slots.
  memories: data.memories.map((memory) => ({
    id: memory.id,
    title: memory.title,
    caption: memory.caption,
  })),
})

const saveRetrospectiveData = (data: RetrospectiveData) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(prepareRetrospectiveDataForStorage(data)),
  )
}

const clearSavedRetrospectiveData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

const revokeRetrospectiveImageUrls = (data: RetrospectiveData | null) => {
  data?.memories.forEach((memory) => {
    if (memory.imagePreviewUrl) {
      URL.revokeObjectURL(memory.imagePreviewUrl)
    }
  })
}

function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    const savedData = loadSavedRetrospectiveData()

    return {
      screen: savedData ? 'retrospective' : 'start',
      data: savedData,
    }
  })

  if (appState.screen === 'start') {
    return (
      <StartScreen
        onStart={() =>
          setAppState((currentState) => ({
            ...currentState,
            screen: 'create',
          }))
        }
      />
    )
  }

  if (appState.screen === 'create') {
    return (
      <CreateRetrospectiveScreen
        onFinish={(formData) => {
          saveRetrospectiveData(formData)
          setAppState({
            screen: 'retrospective',
            data: formData,
          })
        }}
      />
    )
  }

  return (
    <RetrospectivePlayerScreen
      data={appState.data ?? undefined}
      onCreateNew={() => {
        clearSavedRetrospectiveData()
        revokeRetrospectiveImageUrls(appState.data)
        setAppState({
          screen: 'start',
          data: null,
        })
      }}
    />
  )
}

export default App
