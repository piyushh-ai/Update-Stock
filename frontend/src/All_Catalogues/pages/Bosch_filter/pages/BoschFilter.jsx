// DataPage.jsx
import { useParams } from "react-router-dom";
import { useCatalogues } from "../../../hooks/cataloguesHook.js";


const BoschFilter = () => {
  const { company } = useParams();
  const { data, loading } = useCatalogues({
    page: 1,
    limit: 10,
    search: "",
    company,
  });

  

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>{company} Data</h2>

      {data?.map((item) => (
        <div key={item.id} className="card">
          <h4>{item.brand}</h4>
          <p>{item.description}</p>
        </div>
      ))}
      ddfdfsfsf
    </div>
  );
};

export default BoschFilter;
