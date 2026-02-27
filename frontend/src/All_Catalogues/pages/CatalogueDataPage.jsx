// DataPage.jsx
import { useParams } from "react-router-dom";
import BoschFilter from "./Bosch_filter/pages/boschFilter.jsx";
import AutolekFilter from "./Autolek_filter/pages/AutolekFilter.jsx";
import BoschStarter from "./Bosch_AutoElectric/pages/BoschStarter.jsx";
import BoschAlternator from "./Bosch_AutoElectric/pages/BoschAlternator.jsx";
import Rmp from "./RMP/pages/rmp.jsx";

const CatalogueDataPage = () => {
  const { company } = useParams();

  if (company === "Bosch_PC_Filter") return <BoschFilter />;
  if (company === "Autolek_FIlter") return <AutolekFilter />;
  if (company === "Bosch_PC_Starter") return <BoschStarter />;
  if (company === "Bosch_PC_Alternator") return <BoschAlternator />;
  if (company === "RMP_Bearings_Catalogues") return <Rmp />;

  return <h2>Company not found</h2>;
};

export default CatalogueDataPage;
