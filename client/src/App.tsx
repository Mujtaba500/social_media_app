import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/common/Layout";
import NotificationPage from "./pages/NotificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/authContext";
import HomeSkeleton from "./components/skeletons/HomeSkeleton";

function App() {
  const { authUser, isLoading } = useAuthContext();

  return (
    <>
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <Routes>
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignupPage /> : <Navigate to="/" />}
            />
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={authUser ? <HomePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/notifications"
                element={
                  authUser ? <NotificationPage /> : <Navigate to="/login" />
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
