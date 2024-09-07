import UserCard from "./UserCard";

const Suggested = () => {
  return (
    <>
      <div className="min-h-full bg-base-200">
        <div>
          <ul className="menu text-base-content w-80 p-4 gap-5">
            <li>
              <a className="text-white rounded-full ">
                <UserCard />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Suggested;
