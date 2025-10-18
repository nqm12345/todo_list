import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import "./index.css";

function Private({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <Private><Tasks/></Private> },
  { path: "/login", element: <Login/> },
  { path: "/register", element: <Register/> },
  { path: "*", element: <NotFound/> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1a202c',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
