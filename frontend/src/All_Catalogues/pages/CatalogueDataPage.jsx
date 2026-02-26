// DataPage.jsx
import { useParams } from "react-router-dom";
import BoschFilter from "./Bosch_filter/pages/boschFilter.jsx";
import AutolekFilter from "./Autolek_filter/pages/AutolekFilter.jsx";

const CatalogueDataPage = () => {
  const { company } = useParams();

  if (company === "Bosch_PC_Filter") return <BoschFilter />;
  if (company === "Autolek_FIlter") return <AutolekFilter />;

  return <h2>Company not found</h2>;
};

export default CatalogueDataPage;
