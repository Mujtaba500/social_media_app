import { ArrowLeft, CalendarDays, Trash2 } from "lucide-react";
import { useNavigateNoUpdates } from "../context/RouterUtils";
import Posts from "../components/common/post/Posts";
import EditProfileModal from "../components/common/EditProfileModal";
import { useEffect, useState } from "react";
import useGetProfile from "../hooks/useGetProfile";
import { useParams } from "react-router-dom";
import { User } from "../types";
import { useSetRecoilState } from "recoil";
import postsState from "../global/Posts";
import extractMonthAndYear from "../utils/extractDate";
import { useAuthContext } from "../context/authContext";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const ProfilePage = () => {
  const navigate = useNavigateNoUpdates();

  const [user, setUser] = useState<User | null>(null);
  const [monthYear, setMonthYear] = useState("");

  const { authUser } = useAuthContext();

  const { loading, getProfile } = useGetProfile();

  const params = useParams();

  const setPosts = useSetRecoilState(postsState);

  const { followUnfollow, loading: followLoading } = useFollowUnfollow();

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await getProfile(params.username!);
      setUser(response);
      setPosts(response?.posts!);

      const { monthName, year } = extractMonthAndYear(response.createdAt);
      setMonthYear(`${monthName} ${year}`);
    };
    getUserProfile();
  }, [params]);

  const handleFollowUnfollow = async () => {
    const UpdatedUser = await followUnfollow(user?.id!);
    setUser(UpdatedUser);
  };

  return (
    <>
      {/* Page content here */}
      {loading ? (
        <div className="text-center w-full">
          <span className="loading loading-spinner loading-lg m-auto"></span>
        </div>
      ) : (
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
                {user?.fullName}
              </h1>
              <p>{user?.posts!.length} posts</p>
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
            {authUser?.id !== user?.id ? (
              <button
                onClick={handleFollowUnfollow}
                className="btn rounded-full btn-sm  btn-primary btn-outline mr-3 mt-3 ml-5"
              >
                {followLoading ? (
                  <div className="text-center">
                    <span className="loading loading-spinner loading-sm m-auto"></span>
                  </div>
                ) : user?.followers!.includes(authUser!.id) ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>
            ) : (
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
            )}

            <EditProfileModal />
          </div>
          <div className="ml-4 -top-6 relative">
            <h1 className="text-slate-200 text-lg font-bold ">
              {user?.fullName}
            </h1>
            <p>@{user?.username}</p>
            <div className="mt-3 flex">
              <CalendarDays className="mr-2" />
              <p>Joined {monthYear}</p>
            </div>
            <div className="mt-3 flex">
              <p className="mr-2">
                <span className="text-white">{user?.following!.length}</span>{" "}
                Following
              </p>
              <p>
                <span className="text-white">{user?.followers!.length}</span>{" "}
                Followers
              </p>
            </div>
          </div>
          <div className="posts">
            <h1 className="text-white text-center ">Posts</h1>
            <div className="divider my-0 ml-0"></div>
            <Posts />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
