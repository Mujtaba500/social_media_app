import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Layout from "./components/common/Layout";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/authContext";
import HomeSkeleton from "./components/skeletons/HomeSkeleton";
import { lazy, Suspense } from "react";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));

function App() {
  const { authUser, isLoading } = useAuthContext();
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center align-middle h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <Routes>
            <Route
              path="/login"
              element={
                !authUser && !isLoading ? <LoginPage /> : <Navigate to="/" />
              }
            />
            <Route
              path="/signup"
              element={
                !authUser && !isLoading ? <SignupPage /> : <Navigate to="/" />
              }
            />
            <Route
              path="/"
              element={
                // <Suspense fallback={<h1>Loading...</h1>}>
                <Layout />
                // {/* </Suspense> */}
              }
            >
              <Route
                index
                element={
                  authUser && !isLoading ? (
                    <HomePage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/profile/:username"
                element={
                  authUser && !isLoading ? (
                    <ProfilePage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/notifications"
                element={
                  authUser && !isLoading ? (
                    <NotificationPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Route>
          </Routes>
          <Toaster />
        </>
      )}
    </>
  );
}

export default App;
