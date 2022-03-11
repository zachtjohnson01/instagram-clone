import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";

const Login = () => {
  const navigate = useNavigate();
  const { firebase } = useContext(FirebaseContext);

  const initForm = {
    email: "",
    password: ""
  };
  const [form, setForm] = useState(initForm);
  const [error, setError] = useState("");
  const isInvalid = form.email === "" || form.password === "";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(form.email, form.password);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setForm(initForm);
      setError(error.message);
    }
  };
  useEffect(() => {
    document.title = "Login - Instagram";
  }, []);
  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col items-center bg-white p-4 border mb-4">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="Instagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>
          {error && <p className="mb-4 text-xs text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} method="POST">
            <input
              aria-label="Enter your email address"
              placeholder="Email address"
              className="text-sm w-full mr-3 py-5 px-4 h-2 border rounded mb-2"
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
            />
            <input
              aria-label="Enter your password"
              placeholder="Password"
              className="text-sm w-full mr-3 py-5 px-4 h-2 border rounded mb-2"
              name="password"
              type="password"
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
              Log In
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 border">
          <p>
            Don't have an account?{" "}
            <Link to={ROUTES.SIGN_UP} className="font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
