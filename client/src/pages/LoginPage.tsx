import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="text-center flex flex-col max-h-max ">
        <div className="flex justify-center items-center">
          <img src="/public/konekt.png" alt="logo" className="w-12" />
          <h1 className="text-3xl m-5 text-white">Log In </h1>
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
          <input type="text" className="grow " placeholder="Username" />
        </label>
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
          <input type="password" className="grow" placeholder="Password" />
        </label>
        <button
          type="submit"
          className="btn rounded-full btn-neutral text-white m-5"
        >
          Login
        </button>
        <div className="flex flex-col gap-2 ">
          <p className="text-white text-lg mt-1 ">Don't have an account?</p>
          <Link to="/signup">
            <button className="btn text-white btn-outline w-4/5 mx-5 ">
              Sign up
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
