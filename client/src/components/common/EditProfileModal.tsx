import { ImageUp } from "lucide-react";

const EditProfileModal = () => {
  return (
    <>
      <dialog id="editProfileModal" className="modal">
        <div className="modal-box">
          <h1 className="font-bold text-lg text-white">Update Profile</h1>
          <div className="flex gap-4 mt-3">
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full max-w-xs "
            />
            <input
              type="text"
              placeholder="User Name"
              className="input input-bordered w-full max-w-xs "
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Current Password"
              className="input input-bordered w-full max-w-xs my-4"
            />
            <input
              type="text"
              placeholder="New Password"
              className="input input-bordered w-full max-w-xs my-4"
            />
          </div>
          <div className="flex ">
            <div className=" w-1/2">
              <h1>Update Profile Picture</h1>
              <ImageUp size={32} className="ml-3 cursor-pointer mt-2  " />
              <input type="file" id="myFile" name="filename" className="" />
            </div>
            <div>
              <h1>Update Cover Photo</h1>
              <ImageUp size={32} className="ml-3 cursor-pointer mt-2" />
              <input type="file" id="myFile" name="filename" className="" />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-4 rounded-full btn-sm  text-white w-full"
          >
            Update
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
