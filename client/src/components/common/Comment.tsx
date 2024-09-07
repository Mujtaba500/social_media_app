const Comment = () => {
  return (
    <>
      <div className="flex my-4">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span className="">S</span>
          </div>
        </div>
        <div className="ml-2 ">
          <div className="flex items-center">
            <h1 className="text-slate-200 text-lg  font-bold ">
              Portgas D Ace
            </h1>
            <p>@ace123</p>
          </div>
          <p className="text-white">Hello From another world</p>
        </div>
      </div>
    </>
  );
};

export default Comment;
