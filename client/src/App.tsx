import { Toaster } from './components/ui/sonner.tsx'
import { router } from './routes.tsx'
import { RouterProvider } from 'react-router-dom'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
