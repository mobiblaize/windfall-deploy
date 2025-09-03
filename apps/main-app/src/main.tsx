import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/tiptap/styles.css";
import "./index.css";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const customColors: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] = [
  "#ffe7e7",
  "#ffcece",
  "#ff9a9c",
  "#ff6465",
  "#ff2f31",
  "#ff181a",
  "#ff030a",
  "#e40000",
  "#cc0000",
  "#b30000",
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      theme={{
        colors: {
          customColors,
        },
        primaryColor: "customColors",
        primaryShade: 4,
      }}
    >
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </StrictMode>
);
