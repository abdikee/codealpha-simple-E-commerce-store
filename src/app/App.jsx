import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
      <Toaster position="top-right" closeButton richColors />
    </AuthProvider>
  );
}

export default App;
