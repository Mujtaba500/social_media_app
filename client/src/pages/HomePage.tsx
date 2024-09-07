import CreatePost from "../components/common/post/CreatePost";
import Posts from "../components/common/post/Posts";
import Sidebar from "../components/common/Sidebar";
import Suggested from "../components/common/Suggested";

const HomePage = () => {
  return (
    <>
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex  items-center justify-between">
          {/* Page content here */}
          <div className="posts w-full h-full">
            <CreatePost />
            <Posts />
          </div>
          <Suggested />
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default HomePage;
