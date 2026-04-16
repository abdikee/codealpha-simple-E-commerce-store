import { createBrowserRouter, Outlet, useLocation, Navigate } from "react-router";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollRestoration } from "react-router";
import { PageTransition } from "./components/PageTransition";
import { useAuth } from "./context/AuthContext.jsx";

function Root() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Header />
      <main className="flex-grow">
        <PageTransition location={location}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

// Redirect to /login if not authenticated
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// Redirect to / if not admin
function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
      <p className="text-lg text-gray-500 mb-12 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-700 transition-all">Go Home</a>
    </div>
  );
}

export const router = createBrowserRouter([
  // ── Auth pages — no Header/Footer ────────────────────────────────────────
  { path: "/login",           Component: Login },
  { path: "/register",        Component: Register },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/reset-password",  Component: ResetPassword },

  // ── Main app — with Header/Footer ─────────────────────────────────────────
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "shop",         Component: Shop },
      { path: "product/:id",  Component: ProductDetail },
      { path: "cart",         Component: Cart },
      {
        path: "checkout",
        element: <RequireAuth><Checkout /></RequireAuth>,
      },
      {
        path: "account/*",
        element: <RequireAuth><Account /></RequireAuth>,
      },
      {
        path: "admin/*",
        element: <RequireAdmin><Admin /></RequireAdmin>,
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
