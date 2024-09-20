import { useNavigateNoUpdates } from "../../context/RouterUtils";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import useLogout from "../../hooks/useLogout";
import { UserCardProps } from "../../types";
import { LogOut } from "lucide-react";

const UserCard: React.FC<UserCardProps> = ({ auth, user }) => {
  const logout = useLogout();

  const navigate = useNavigateNoUpdates();

  const { followUnfollow } = useFollowUnfollow();

  const handleClick = async () => {
    navigate(`/profile/${user?.username}`);
  };

  const handleFollow = async () => {
    await followUnfollow(user?.id!);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="userCard flex items-center justify-center w-full"
      >
        <div className="avatar placeholder">
          {user?.profilepic ? (
            <img src={`${user.profilepic}`} className="w-12 rounded-full" />
          ) : (
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span>{user?.fullName.slice(0, 1)}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="ml-3">
            <p className=" text-white text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
              {user?.fullName}
            </p>
            <p>@{user?.username}</p>
          </div>

          {auth === true ? (
            <div className="ml-12 mr-2">
              <LogOut onClick={logout} />
            </div>
          ) : (
            <button
              onClick={(e) => {
                handleFollow();
                e.stopPropagation();
              }}
              className="btn rounded-full btn-sm  btn-primary btn-outline ml-5"
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserCard;
