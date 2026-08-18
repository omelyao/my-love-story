import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { routes } from './routes/routes'

import type { RootState } from './providers/store'

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) =>
      state.auth.isAuthenticated
  )

  return (
    <Routes>

      {/* ========================================
             ПРИВАТНЫЕ МАРШРУТЫ
         ======================================== */}

      {routes.private.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            isAuthenticated ? (
              <route.component />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        />
      ))}


      {/* ========================================
             ПУБЛИЧНЫЕ МАРШРУТЫ
         ======================================== */}

      {routes.public.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            !isAuthenticated ? (
              <route.component />
            ) : (
              <Navigate
                to="/love"
                replace
              />
            )
          }
        />
      ))}

    </Routes>
  )
}

export default App
