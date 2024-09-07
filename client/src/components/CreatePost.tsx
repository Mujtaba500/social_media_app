import { ImageUp } from "lucide-react";

const CreatePost = () => {
  return (
    <>
      <div className="h-full">
        <textarea
          className="textarea textarea-bordered textarea-lg w-full h-1/6 m-0"
          placeholder="What's on your mind?"
        ></textarea>
        <div className="flex justify-between items-center my-1">
          <ImageUp size={32} className="ml-3 cursor-pointer" />
          <input type="file" id="myFile" name="filename" className="" />
          <button
            type="submit"
            className="btn btn-primary btn-sm rounded-full py-0 px-6 text-white mr-3"
          >
            Post
          </button>
        </div>
        <div className="divider mt-0"></div>
      </div>
    </>
  );
};

export default CreatePost;
