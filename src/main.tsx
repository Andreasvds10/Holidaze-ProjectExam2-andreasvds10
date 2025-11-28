// src/main.tsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";
import App from "./routes/App";
import "./index.css";
import { useAuth } from "./features/bookings/Auth/store";

function Root() {
  // Initialize auth store once on application startup
  useEffect(() => {
    useAuth.getState().init();
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

createRoot(container).render(<Root />);
