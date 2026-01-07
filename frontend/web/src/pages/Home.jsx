import { useEffect, useState } from "react";
import MessageBox from "../components/MessageBox/MessageBox";

function Home({ currentUser }) {
  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      fetch(`${apiUrl}/Messages/all`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper" >
      <h1> User Logged In, Welcome {currentUser?.userName} </h1>
      <div className="container" >
        {data.map((x) => (
          <MessageBox 
          key={x.id}
          messageData={x}
          isOwnMessage={x.userId === currentUser.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
