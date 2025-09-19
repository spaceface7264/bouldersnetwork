import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModalProvider } from '@/context/ModalContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
})

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ModalProvider>{children}</ModalProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
