import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Login } from "./components/Login/Login";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {user ? (
        <div>application</div>
      ) : (
        <div>
          <Login setUser={setUser} />

          <ToastContainer />
        </div>
      )}
    </div>
  );
}

export default App;
