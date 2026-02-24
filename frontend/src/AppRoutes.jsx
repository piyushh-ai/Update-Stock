import { createBrowserRouter } from "react-router";
import Home from "./home/pages/Home";
import Menuhook from "./components/common/header+menu/hooks/Menuhook";
import FullBoschStock from "./boschStock/pages/FullBoschStock";
import CompanySheetsPage from "./lucasStock/pages/CompanySheetsPage";
import CompanyStockBySheetPage from "./lucasStock/pages/CompanyStockBySheetPage";
import BoschPriceList from "./Bosch_Pricelist/pages/BoschPriceList";

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
      {
        path: "/company",
        element: <CompanySheetsPage />,
      },
      {
        path: "/company/:sheetName",
        element: <CompanyStockBySheetPage />,
      },
      {
        path: "/BoschPriceList",
        element: <BoschPriceList/>,
      },
    ],
  },
]);
