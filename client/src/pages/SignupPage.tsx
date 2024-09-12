import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSignup from "../hooks/useSignup";

const SignupPage = () => {
  const { signup, loading } = useSignup();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      fullName: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "username must be atleast 3 characters long")
        .max(20, "username cannot exceed 20 characters")
        .matches(
          /^[0-9a-z]*$/,
          "Username can only contain alphanumeric characters"
        )
        .required("Required"),
      fullName: Yup.string()
        .min(3, "fullName must be atleast 3 characters long")
        .max(20, "fullName cannot exceed 20 characters")
        .required("Required"),
      password: Yup.string()
        .min(6, "Password must be 6 characters long")
        .max(30, "Password must not exceed 30 characters")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      signup(values);
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="text-center flex flex-col max-h-max "
      >
        <div className="flex justify-center items-center">
          <img src="/public/konekt.png" alt="logo" className="w-12" />
          <h1 className="text-3xl m-5  text-white">Sign Up </h1>
        </div>
        <label className="input input-bordered flex items-center gap-2 mt-5 mx-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            name="username"
            className="grow "
            placeholder="Username"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
        </label>
        {formik.touched.username && formik.errors.username ? (
          <p className="text-red-600 italic text-s">{formik.errors.username}</p>
        ) : null}
        <label className="input input-bordered flex items-center gap-2 mt-5 mx-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            name="fullName"
            className="grow "
            placeholder="FullName"
            onChange={formik.handleChange}
            value={formik.values.fullName}
          />
        </label>
        {formik.touched.fullName && formik.errors.fullName ? (
          <p className="text-red-600 italic text-s">{formik.errors.fullName}</p>
        ) : null}
        <label className="input input-bordered flex items-center gap-2 m-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            name="password"
            className="grow"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </label>
        {formik.touched.password && formik.errors.password ? (
          <p className="text-red-600 italic text-s">{formik.errors.password}</p>
        ) : null}
        <button
          type="submit"
          className="btn rounded-full btn-neutral text-white m-5"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <div className="flex flex-col gap-2 ">
          <p className="text-white text-lg mt-1 ">Already have an account?</p>
          <Link to="/login">
            <button className="btn text-white btn-outline w-4/5 mx-5 ">
              Log In
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
