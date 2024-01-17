import { prettyDOM } from "@testing-library/react";
import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onsubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      console.log(user);
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
      toast.success("Sign-up was  successful");
    } catch (error) {
      toast.error("Something went wrong with the registration");
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://media.istockphoto.com/id/1464628759/photo/fingerprint-scan-for-secure-access-and-service-unlock-design-concept.webp?b=1&s=170667a&w=0&k=20&c=o4zMDBEfLtOZTi0mQG3A_HmqcXqGWX_JvOxTrTmQ4ec="
            alt="auth"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onsubmit}>
            <input
              className=" mb-6 w-full px-4 py-2 text-xl text-gray-600 bg-white border-gray-300 rounded transition ease-out"
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Full Name"
            ></input>
            <input
              className=" mb-6 w-full px-4 py-2 text-xl text-gray-600 bg-white border-gray-300 rounded transition ease-out"
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
            ></input>
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-xl text-gray-600 bg-white border-gray-300 rounded transition ease-out"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="password"
              ></input>
              {showPassword ? (
                <FaEyeSlash
                  className="absolute right-3 top-3 text-xl cursor-pointe"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <FaEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6 ">
                Have an account?
                <Link
                  to="/sign-in"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-4"
                >
                  Login
                </Link>
              </p>
              <p>
                <Link
                  to="/forget-password"
                  className="text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out ml-4"
                >
                  Forget Password
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg action:bg-blue-800"
              type="submit"
            >
              Sign Up
            </button>
            <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-700 after:border-t after:flex-1 after:border-gray-700">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth></OAuth>
          </form>
        </div>
      </div>
    </section>
  );
}
