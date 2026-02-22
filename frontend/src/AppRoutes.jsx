import { createBrowserRouter } from "react-router";
import Home from "./home/pages/Home";
import Menuhook from "./components/common/header+menu/hooks/Menuhook";
import FullBoschStock from "./boschStock/pages/FullBoschStock";

export const router = createBrowserRouter([
 {
    path: "/",
    element: <Menuhook />,   
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/bosch-stock",
        element: <FullBoschStock />,
      },
    ],
  },
]);
