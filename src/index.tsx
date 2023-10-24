import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, RouterProvider, createBrowserRouter } from "react-router-dom";
import theme from "./App.theme";
import { ThemeProvider } from "@emotion/react";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { UserProvider } from "./context/UserProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);