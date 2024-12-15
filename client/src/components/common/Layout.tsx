import { Outlet } from "react-router-dom";
import Suggested from "./Suggested";
import Sidebar from "./Sidebar";
import { Suspense } from "react";

function Layout() {
  return (
    <div className="drawer md:drawer-open h-full">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex items-center justify-between">
        <Suspense
          fallback={
            <div className="flex justify-center align-middle h-screen">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          <Outlet /> {/* Dynamic content will go here */}
        </Suspense>
        <Suggested />
      </div>
      <Sidebar />
    </div>
  );
}

export default Layout;
