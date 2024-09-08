import { Outlet } from "react-router-dom";
import Suggested from "./Suggested";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="drawer md:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex items-center justify-between">
        <Outlet /> {/* Dynamic content will go here */}
        <Suggested />
      </div>
      <Sidebar />
    </div>
  );
}

export default Layout;
