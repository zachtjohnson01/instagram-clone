import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import { doesUsernameExist } from "../services/firebase";
import * as ROUTES from "../constants/routes";

const SignUp = () => {
  const userNameRef = useRef();
  const navigate = useNavigate();
  const { firebase } = useContext(FirebaseContext);
  const initForm = {
    userName: "",
    fullName: "",
    email: "",
    password: ""
  };
  const [form, setForm] = useState(initForm);
  const [error, setError] = useState("");
  const isInvalid =
    form.userName === "" ||
    form.fullName === "" ||
    form.email === "" ||
    form.password === "";
  const handleChange = (e) => {
    const val =
      e.target.name === "email" || e.target.name === "userName"
        ? e.target.value.toLowerCase().replace(/\s/g, "")
        : e.target.value;
    setForm({
      ...form,
      [e.target.name]: val
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameExists = await doesUsernameExist(form.userName);
    if (!usernameExists) {
      try {
        const createUserRespose = await firebase
          .auth()
          .createUserWithEmailAndPassword(form.email, form.password);
        await createUserRespose.user.updateProfile({
          displayName: form.userName
        });
        await firebase.firestore().collection("users").add({
          userId: createUserRespose.user.uid,
          username: form.userName,
          fullName: form.fullName,
          emailAddress: form.email,
          following: [],
          followers: [],
          dateCreated: Date.now()
        });
        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        setForm(initForm);
        setError(error.message);
      }
    } else {
      setError(
        `The username '${form.userName}' is taken. Please choose something different.`
      );
      userNameRef.current.focus();
      setForm({
        ...form,
        userName: ""
      });
    }
  };
  useEffect(() => {
    document.title = "Instagram - Sign Up";
  }, []);
  return (
    <div className="container flex mx-auto max-w-xs items-center h-screen">
      <div className="flex flex-col">
        <div className="flex flex-col items-center bg-white p-4 border mb-4">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="Instagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>
          {error && <p className="mb-4 text-sx text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              name="userName"
              className="text-sm w-full mr-3 py-5 px-4 h-2 border rounded mb-2"
              placeholder="Username"
              type="text"
              aria-label="Enter your username"
              value={form.userName}
              onChange={handleChange}
              ref={userNameRef}
            />
            <input
              name="fullName"
              className="text-sm w-full mr-3 py-5 px-4 h-2 border rounded mb-2"
              placeholder="Full name"
              type="text"
              aria-label="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
            />
            <input
              name="email"
              className="text-sm w-full mr-3 py-5 px-4 h-2 border rounded mb-2"
              placeholder="Email address"
              type="text"
              aria-label="Enter your email address"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="password"
              className="text-sm w-full mr-3 py-5 px-4 h-2 border rounded mb-2"
              placeholder="Password"
              type="password"
              aria-label="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-500 text-white w-full rounded h-8 font-bold ${
                isInvalid && "cursor-not-allowed opacity-50"
              }`}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 border">
          <p>
            Have an account?{" "}
            <Link to={ROUTES.LOGIN} className="font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
