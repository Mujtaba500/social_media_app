import UserCard from "./UserCard";

const Suggested = () => {
  console.log("suggested");

  return (
    <>
      <div className="min-h-full bg-base-200 ">
        <div>
          <ul className="menu text-base-content p-4 gap-5">
            <li>
              <a className="text-white rounded-full ">
                <UserCard />
              </a>
            </li>
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
