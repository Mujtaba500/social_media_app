import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigateNoUpdates } from "../context/RouterUtils";
import Posts from "../components/common/post/Posts";

const ProfilePage = () => {
  const navigate = useNavigateNoUpdates();

  return (
    <>
      {/* Page content here */}
      <div className="posts w-full h-full">
        <div className="header flex items-center mt-3">
          <ArrowLeft
            className="mx-4 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
          <div>
            <h1 className="text-slate-200 text-lg  font-bold ">
              Portgas D Ace
            </h1>
            <p>3 posts</p>
          </div>
        </div>
        <div className="divider my-0 ml-0"></div>
        <img
          src="/public/cover.png"
          className="h-52 w-full object-cover"
          alt="cover image"
        />
        <div className="flex justify-between ">
          <img
            src={"/public/profilepic.png"}
            className="w-32 rounded-full -top-16 -right-4 relative "
          />
          <button className="btn rounded-full btn-sm  btn-primary btn-outline mr-3 mt-3 ">
            Edit profile
          </button>
        </div>
        <div className="ml-4 -top-6 relative">
          <h1 className="text-slate-200 text-lg font-bold ">Portgas D Ace</h1>
          <p>@burnout</p>
          <div className="mt-3 flex">
            <CalendarDays className="mr-2" />
            <p>Joined Septembar 2024</p>
          </div>
          <div className="mt-3 flex">
            <p className="mr-2">
              <span className="text-white">2</span> Following
            </p>
            <p>
              <span className="text-white">3</span> Followers
            </p>
          </div>
        </div>
        <div className="posts">
          <h1 className="text-white text-center ">Posts</h1>
          <div className="divider my-0 ml-0"></div>
          <Posts />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
