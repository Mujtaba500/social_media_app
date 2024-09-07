import { UserCardProps } from "../types";
import { LogOut } from "lucide-react";

const UserCard: React.FC<UserCardProps> = ({ auth }) => {
  return (
    <>
      <div className="userCard flex items-center justify-between">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span className="">M</span>
          </div>
        </div>
        <div className="ml-3">
          <p className=" text-white text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
            Portgas D Ace
          </p>
          <p>@ace123</p>
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
