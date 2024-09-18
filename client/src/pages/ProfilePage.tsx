import { ArrowLeft, CalendarDays, Trash2 } from "lucide-react";
import { useNavigateNoUpdates } from "../context/RouterUtils";
import Posts from "../components/common/post/Posts";
import EditProfileModal from "../components/common/EditProfileModal";
import useGetPosts from "../hooks/Post/useGetPosts";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import postsState from "../global/Posts";

const ProfilePage = () => {
  const navigate = useNavigateNoUpdates();
  const posts = useRecoilValue(postsState);
  const { getPosts } = useGetPosts();

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {/* Page content here */}
      <div className="profile w-full h-full">
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
        <div className="divider my-0 ml-0 "></div>
        <div className=" justify-end my-0 flex p-0 h-0 ">
          <Trash2
            size={20}
            className="cursor-pointer -left-3 -bottom-4 hover:text-red-600 relative my-0"
          />
        </div>
        <img
          src="/public/cover.png"
          id="cover"
          className="h-52 w-full object-cover"
          alt="cover image"
        />

        <div className="flex justify-between ">
          <div className="flex group">
            <img
              src={"/public/profilepic.png"}
              className="w-32 rounded-full -top-16 -right-4 relative "
            />
            <Trash2
              size={20}
              className="cursor-pointer -top-10 -left-4 opacity-0 group-hover:opacity-100 text-red-500  hover:text-red-600 relative my-0"
            />
          </div>
          <button
            className="btn rounded-full btn-sm  btn-primary btn-outline mr-3 mt-3 "
            onClick={() => {
              const modal = document.getElementById(
                "editProfileModal"
              ) as HTMLDialogElement;
              if (modal) {
                modal.showModal();
              }
            }}
          >
            Edit profile
          </button>
          <EditProfileModal />
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
          <Posts posts={posts} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
