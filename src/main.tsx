import ReactDOM from "react-dom/client";
import { ColorModeScript } from "@chakra-ui/react";

import theme from "./theme.ts";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>
);
