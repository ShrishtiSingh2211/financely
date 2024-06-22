import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";
import { auth, db, doc, provider, setDoc } from "../../firebase";
import { GoogleAuthProvider, createUserWithEmailAndPassword , signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";

const SignupSignin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login ,setLogin] = useState(false);
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();


  // FUNCTION FOR SIGN UP
  function signupWithEmail() {
    // Autheticate the user with email and password or create a user with the same
    setLoading(true);
   
    if (
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            toast.success("User Created Successfully");
            setConfirmPassword("")
            setEmail("")
            setName("")
            setPassword("")
            setLoading(false)
            createDoc(user)
            navigate("/dashboard") 
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
             setLoading(false)
            // ..
          });
      }else{
        toast.error("Password and Confirm Password don't match")
         setLoading(false)
      }
    } else {
      toast.error("All Fields are required");
       setLoading(false)
    }
  }

//  FUNCTION FOR LOGIN

 function loginUsingEmail(){
  setLoading(true)
  if(email.trim() !== "" &&  password.trim() !== ""){

    
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user; 
          toast.success(`Welcome! you are Successfully Logged in`)
          setLoading(false)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false)
        });

  } else{
    toast.error("All fields are mandatory")
    setLoading(false)
  }   

     
 }


//  FUNCTION FOR CREATING THE DOC
  async  function createDoc(user){
       if(!user) return
       
      
       const useRef = doc(db , "users" , user.uid)
       console.log(useRef)
       const userData = await getDoc(useRef)
       console.log(userData)

     if(!userData.exists()){
      try{
        await setDoc(doc(db, "users" ,user.uid),{
          name : user.displayName ? user.displayName : name,
          email : user.email ,
          photoURL : user.photoURL ? user.photoURL : "",
          createdAt:new Date(),

        });
        toast.success("doc created")
      }
      catch(e){
       toast.error(e.message)
      }
     }else{
      toast.error("Doc already exists")
     }
    }


// FUNCTION WITH GOOGLE AUTHENTICATION

    function signUpWithGoogle(){

   
     
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          console.log(user)
          createDoc(user)
          toast.success("successfully Logged in");
          navigate("/dashboard");
          
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          toast.error(errorMessage)
        });
        
     
    }

  return (
    <> {login ?
     
      // LOGIN SECTION
      <div className="signup-wrapper">
           <h2 className="title">
        Login on  <span style={{ color: "var(--theme)" }}>Financely.</span>
      </h2>
      <form>
        <Input
          type="email"
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"JohnDeo@gmail.com"}
        />
        <Input
          type="password"
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"}
        />
        <Button
          disabled = {loading}
          text={ loading ?"Loading..." : "Login Using Email and Password"}
          onClick={loginUsingEmail}
        />
        <p className="p-login">or</p>
        <Button text={ loading ?"Loading..." : "Login Using Google"} blue={true} 
         onClick={signUpWithGoogle} />
        <p className="p-login">or Don't Have An Account ? <span className = "blue" onClick={(e) => setLogin(false)} >Click Here</span> </p>
      </form>
    </div> 

    :
    
     // SIGN IN SECTION
    <div className="signup-wrapper">
      <h2 className="title">
        Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
      </h2>
      <form>
        <Input
          type="text"
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"John Deo"}
        />
        <Input
          type="email"
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"JohnDeo@gmail.com"}
        />
        <Input
          type="password"
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"}
        />
        <Input
          type="password"
          label={"Confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder={"Example@123"}
        />
        <Button
          disabled = {loading}
          text={ loading ?"Loading..." : "SignUp Using Email and Password"}
          onClick={signupWithEmail}
        />
        <p className="p-login" >or</p>
        <Button text={ loading ?"Loading..." : "SignUp Using Google"} blue={true} 
         onClick={signUpWithGoogle} /> 
        <p className="p-login" >or Have An Account  Already ? <span className = "blue" onClick={(e) => setLogin(true)} >Click Here</span>  </p>
      </form>
    </div>
    
}
    </>
   
  );
};

export default SignupSignin;
