import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Login } from "./components/Login/Login";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { CircularProgress } from "@mui/material";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => {
      setLoadingAuth(false);
      if (newUser) {
        setUser(newUser);
      } else {
        setUser(null);
      }
    });
  });

  return (
    <div className="App">
      {loadingAuth ? (
        <CircularProgress />
      ) : user ? (
        <div>
          <button
            onClick={() => {
              signOut(auth);
            }}
          >
            sign out
          </button>
        </div>
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
