import { UserCardProps } from "../../types";
import { LogOut } from "lucide-react";

const UserCard: React.FC<UserCardProps> = ({ auth, user }) => {
  console.log(user);
  return (
    <>
      <div className="userCard flex items-center justify-between">
        <div className="avatar placeholder">
          {user?.profilepic ? (
            <img src={`${user.profilepic}`} className="w-12 rounded-full" />
          ) : (
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span>{user?.fullName.slice(0, 1)}</span>
            </div>
          )}
        </div>
        <div className="ml-3">
          <p className=" text-white text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
            {user?.fullName}
          </p>
          <p>{user?.username}</p>
        </div>

        {auth === true ? (
          <div className="ml-12">
            <LogOut />
          </div>
        ) : (
          <button className="btn rounded-full btn-sm  btn-primary btn-outline ml-5">
            Follow
          </button>
        )}
      </div>
    </>
  );
};

export default UserCard;
