const UserCard = () => {
  return (
    <>
      <div className="userCard flex items-center">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span className="">M</span>
          </div>
        </div>
        <div className="ml-3">
          <p className=" text-white text-xl whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
            Portgas D Ace
          </p>
          <p>@ace123</p>
        </div>
        <button className="btn rounded-full btn-primary btn-outline ml-5">
          Follow
        </button>
      </div>
    </>
  );
};

export default UserCard;
