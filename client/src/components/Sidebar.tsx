const Sidebar = () => {
  return (
    <div className="drawer-side min-h-full bg-base-200">
      <div>
        <ul className="menu text-base-content w-80 p-4 gap-5">
          {/* Sidebar content here */}

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
      </div>
    </div>
  );
};

export default Sidebar;
