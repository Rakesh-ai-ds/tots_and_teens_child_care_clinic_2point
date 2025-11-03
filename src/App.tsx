import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@radix-ui/react-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './components/theme-provider';
import Layout from './components/layout';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background">
          <Toaster />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* Add more routes here */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
