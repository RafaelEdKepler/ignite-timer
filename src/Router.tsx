import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { History } from './pages/History'

export function Router() {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/history" Component={History} />
    </Routes>
  )
}
