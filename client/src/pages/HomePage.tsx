import Sidebar from "../components/Sidebar";
import Suggested from "../components/Suggested";

const HomePage = () => {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-between">
          {/* Page content here */}
          <Suggested />
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default HomePage;
