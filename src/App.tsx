import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { RetrospectivePlayerScreen } from './components/RetrospectivePlayerScreen'
import type { RetrospectiveData } from './data/retrospective'
import { CreateRetrospectiveScreen } from './pages/CreateRetrospectiveScreen'
import { PublicRetrospectivePage } from './pages/PublicRetrospectivePage'
import { StartScreen } from './components/StartScreen'

const STORAGE_KEY = 'retrospective_data'

type AppScreen = 'start' | 'create' | 'retrospective'

type AppState = {
  screen: AppScreen
  data: RetrospectiveData | null
  savedSlug: string | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getSlugFromStorageValue = (value: unknown) => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (isRecord(value) && typeof value.slug === 'string' && value.slug.trim()) {
    return value.slug
  }

  return null
}

const loadSavedRetrospectiveSlug = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY)

    if (!savedData) {
      return null
    }

    const slug = getSlugFromStorageValue(JSON.parse(savedData))

    if (!slug) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug }))
    }

    return slug
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const saveRetrospectiveReference = (data: RetrospectiveData) => {
  if (typeof window === 'undefined') {
    return
  }

  if (!data.slug) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  // Persist only the public slug. Files, Blob URLs and generated previews stay in React state.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug: data.slug }))
}

const clearSavedRetrospectiveData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

const revokeRetrospectiveImageUrls = (data: RetrospectiveData | null) => {
  if (data?.coverPreviewUrl) {
    URL.revokeObjectURL(data.coverPreviewUrl)
  }

  if (data?.storyPhotoPreviewUrl) {
    URL.revokeObjectURL(data.storyPhotoPreviewUrl)
  }

  data?.memories.forEach((memory) => {
    if (memory.imagePreviewUrl) {
      URL.revokeObjectURL(memory.imagePreviewUrl)
    }
  })
}

function CreationFlow() {
  const [appState, setAppState] = useState<AppState>(() => {
    const savedSlug = loadSavedRetrospectiveSlug()

    return {
      screen: 'start',
      data: null,
      savedSlug,
    }
  })

  if (appState.screen === 'start' && appState.savedSlug) {
    return (
      <Navigate
        to={`/retrospectiva/${encodeURIComponent(appState.savedSlug)}`}
        replace
      />
    )
  }

  if (appState.screen === 'start') {
    return (
      <StartScreen
        onStart={() =>
          setAppState((currentState) => ({
            ...currentState,
            screen: 'create',
            savedSlug: null,
          }))
        }
      />
    )
  }

  if (appState.screen === 'create') {
    return (
      <CreateRetrospectiveScreen
        onCreated={saveRetrospectiveReference}
        onFinish={(formData) => {
          saveRetrospectiveReference(formData)
          setAppState({
            screen: 'retrospective',
            data: formData,
            savedSlug: formData.slug ?? null,
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
          savedSlug: null,
        })
      }}
    />
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreationFlow />} />
      <Route path="/retrospectiva/:slug" element={<PublicRetrospectivePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
