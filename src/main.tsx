import ReactDOM from "react-dom/client";
import { ColorModeScript } from "@chakra-ui/react";
import { createHashRouter, RouterProvider } from "react-router-dom";

import theme from "./theme.ts";
import Root from "./routes/Root.tsx";
import ErrorPage from "./ErrorPage.tsx";
import Room from "./routes/Room.tsx";
import Home from "./routes/Home.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/room/:roomId",
        element: <Room />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <RouterProvider router={router} />
  </>
);
