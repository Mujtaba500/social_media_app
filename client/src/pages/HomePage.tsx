import CreatePost from "../components/CreatePost";
import Sidebar from "../components/Sidebar";
import Suggested from "../components/Suggested";

const HomePage = () => {
  return (
    <>
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex  items-center justify-between">
          {/* Page content here */}
          <div className="posts w-full h-full">
            <CreatePost />
          </div>
          <Suggested />
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default HomePage;
