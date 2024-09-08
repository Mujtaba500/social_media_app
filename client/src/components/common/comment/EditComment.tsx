const EditComment = () => {
  return (
    <>
      <div className="flex items-center">
        <textarea
          className="textarea textarea-bordered textarea-lg w-full m-0"
          placeholder="Update comment"
        ></textarea>
        <button className="btn btn-primary btn-sm rounded-full py-0 px-6 ml-4 mr-0 text-white ">
          Update
        </button>
      </div>
    </>
  );
};

export default EditComment;
