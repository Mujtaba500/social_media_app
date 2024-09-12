import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { RouterUtils } from "./context/RouterUtils.tsx";
import AuthContextProvider from "./context/authContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RouterUtils>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </RouterUtils>
    </BrowserRouter>
  </StrictMode>
);
