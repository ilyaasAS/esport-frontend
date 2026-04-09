import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router.tsx'

export function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
