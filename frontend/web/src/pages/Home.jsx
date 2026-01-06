import { useEffect, useState } from "react";

function Home({currentUser}) {
  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchMessages = async () => {
    fetch(`${apiUrl}/Messages/all`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
    }

    fetchMessages();

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1> User Logged In, Welcome {currentUser?.userName} </h1>
      <div>
        <h1> Merhaba </h1>
        {data.map((x) => (
          <p key={x.id}>{x.content}</p>
        ))}
      </div>
    </div>
  );
}

export default Home;
