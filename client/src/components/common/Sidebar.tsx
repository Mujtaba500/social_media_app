import UserCard from "./UserCard";
import { User, Bell, MessageSquareMore } from "lucide-react";
import { useNavigateNoUpdates } from "../../context/RouterUtils";

const Sidebar = () => {
  console.log("sidebar refresh");
  const navigate = useNavigateNoUpdates();

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="drawer-side bg-base-200 w-1  ">
      <div className="flex flex-col justify-between min-h-full">
        <ul className="menu text-base-content w-80 p-4 gap-5">
          {/* Sidebar content here */}

          <li onClick={handleNavigateHome}>
            <p className="text-white text-2xl ">
              <img src="/public/konekt.png" alt="logo" className="w-10 mr-4" />
              Konekt
            </p>
          </li>
          <li onClick={handleNavigateProfile}>
            <a className="text-white text-lg">
              <User size={32} />
              My Profile
            </a>
          </li>
          <li>
            <a className="text-white text-lg">
              <Bell size={32} />
              Notifications
            </a>
          </li>
          <li>
            <a className="text-white text-lg">
              <MessageSquareMore size={32} />
              Messages
            </a>
          </li>
        </ul>

        <ul className="menu text-base-content w-80 ">
          <li>
            <a className="text-white rounded-full ">
              <UserCard />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
