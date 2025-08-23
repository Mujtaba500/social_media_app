import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { RouterUtils } from "./context/RouterUtils.tsx";
import AuthContextProvider from "./context/authContext.tsx";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RouterUtils>
      <RecoilRoot>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </RecoilRoot>
    </RouterUtils>
  </BrowserRouter>
);
