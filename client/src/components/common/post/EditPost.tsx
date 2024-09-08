import { ImageUp } from "lucide-react";

const EditPost = () => {
  return (
    <>
      <dialog id="editPostModal" className="modal">
        <div className="modal-box">
          <div className="flex items-center">
            <textarea
              className="textarea textarea-bordered textarea-lg w-full m-0"
              placeholder="Edit Post"
            ></textarea>
            <button className="btn btn-primary btn-sm rounded-full py-0 px-6 ml-4 mr-0 text-white ">
              Update
            </button>
            <ImageUp size={32} className="ml-3 cursor-pointer" />
            <input type="file" id="myFile" name="filename" className="hidden" />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditPost;
