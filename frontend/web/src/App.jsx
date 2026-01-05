import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/Messages/all`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, [apiUrl]);

  return (
    <>
      <div>
        <h1> Merhaba </h1>
        {data.map((x) => (
          <p key={x.id}>{x.content}</p>
        ))}
      </div>
    </>
  );
}

export default App;
