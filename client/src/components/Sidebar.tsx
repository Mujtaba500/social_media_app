import UserCard from "./UserCard";

const Sidebar = () => {
  return (
    <div className="drawer-side bg-base-200 ">
      <div className="flex flex-col justify-between min-h-full">
        <ul className="menu text-base-content w-80 p-4 gap-5">
          {/* Sidebar content here */}

          <li>
            <img src="/public/konekt.png" alt="logo" className="w-28" />
          </li>
          <li>
            <a className="text-white text-2xl">My Profile</a>
          </li>
          <li>
            <a className="text-white text-2xl">Notifications</a>
          </li>
          <li>
            <a className="text-white text-2xl">Messages</a>
          </li>
        </ul>

        <ul className="menu text-base-content w-80 ">
          <li>
            <a className="text-white rounded-full ">
              <UserCard auth={true} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
