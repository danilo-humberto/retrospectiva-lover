import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import './style.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Elemento root nao encontrado.')
}

createRoot(root).render(
  createElement(
    StrictMode,
    null,
    createElement(BrowserRouter, null, createElement(App)),
  ),
)
