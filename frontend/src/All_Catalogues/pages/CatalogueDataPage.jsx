// DataPage.jsx
import { useParams } from "react-router-dom";
import { useCataloues } from "../hooks/cataloguesHook.js";

const CatalogueDataPage = () => {
  const { company } = useParams();
  const { data, loading } = useCataloues({
    page: 1,
    limit: 10,
    search: "",
    company,
  });

  console.log(data);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      {/* <h2>{type} Data</h2>

      {data?.map((item) => (
        <div key={item.id} className="card">
          <h4>{item.name}</h4>
          <p>{item.description}</p>
        </div>
      ))} */}
      ddfdfsfsf
    </div>
  );
};

export default CatalogueDataPage;
