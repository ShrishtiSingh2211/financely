import React, { useEffect } from "react";
import "../Header/style.css";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import imgLogo from "../../assets/user.svg";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  //  console.log(user)
  //  console.log(loading)
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function funcLogOut() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("User Logged Out Successfully ");
          navigate("/");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">Financely.</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src={user.photoURL ? user.photoURL : imgLogo}
            style={{
              borderRadius: "50%",
              height: "1.5rem",
              width: "1.5rem",
              cursor: "pointer",
            }}
          />
          <p onClick={funcLogOut} className="link">
            Logout
          </p>
        </div>
      )}
      {/* <p onClick={funcLogOut} className='link'>Logout</p> */}
    </div>
  );
};

export default Header;
