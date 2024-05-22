import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/index'
import { History } from './pages/History'
import { DefaultLayout } from './layouts/DefaultLayout/index'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" Component={Home} />
        <Route path="/history" Component={History} />
      </Route>
    </Routes>
  )
}
