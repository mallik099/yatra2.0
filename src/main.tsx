import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { LanguageProvider } from './contexts/LanguageContext';
import "./index.css";
import "./styles/ios-widgets.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
} else {
  console.error('Root element not found');
  document.body.innerHTML = '<h1>Error: Root element not found</h1>';
}
