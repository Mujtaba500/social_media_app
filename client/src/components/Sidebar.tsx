const Sidebar = () => {
  return (
    <div className="drawer-side min-h-full bg-base-200">
      <div>
        <ul className="menu text-b  ase-content w-80 p-4 gap-5">
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
      </div>
    </div>
  );
};

export default Sidebar;
