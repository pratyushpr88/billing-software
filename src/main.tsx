import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: "90px",
            fontSize: "16px",
            fontWeight: "500",
            backgroundColor: "#000",
            color: "#FFF",
            maxWidth: "100%",
            textAlign: "center",
          },
        }}
      />
    </NextUIProvider>
  </React.StrictMode>
);
