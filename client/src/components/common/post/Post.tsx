import { Trash2, Pencil, ThumbsUp, MessageCircle } from "lucide-react";
import Comments from "../comment/Comments";
import EditPost from "./EditPost";

const Post = () => {
  return (
    <div>
      <div className="flex justify-between ml-4 ">
        <div className="flex">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span className="">M</span>
            </div>
          </div>
          <div className="ml-2 ">
            <h1 className="text-slate-200 text-lg  font-bold ">
              Portgas D Ace
            </h1>
            <p className="text-white">Hello From another world</p>
          </div>
        </div>
        <div className="flex">
          <Pencil
            size={20}
            className="cursor-pointer mr-2 hover:text-blue-400"
            onClick={() => {
              const modal = document.getElementById(
                "editPostModal"
              ) as HTMLDialogElement;
              if (modal) {
                modal.showModal();
              }
            }}
          />
          <Trash2
            size={20}
            className="cursor-pointer mr-4 hover:text-red-600"
          />
        </div>
      </div>
      <div className=" mt-4 flex justify-center">
        <img
          className="ml-49 self-center justify-self-center"
          src="../../../public/konekt.png"
          alt="postImg"
        />
      </div>
      <div className="flex m-4 justify-around">
        <div className="flex">
          <ThumbsUp size={20} className="cursor-pointer hover:text-blue-400" />
          <p className="ml-1">2</p>
        </div>
        <div className="flex">
          <MessageCircle
            size={20}
            onClick={() => {
              const modal = document.getElementById(
                "myModal"
              ) as HTMLDialogElement;
              if (modal) {
                modal.showModal();
              }
            }}
            className="cursor-pointer hover:text-green-400"
          />
          <p className="ml-1">2</p>
        </div>
      </div>
      <dialog id="myModal" className="modal">
        <div className="modal-box">
          <h1 className="font-bold text-lg text-white">COMMENTS</h1>
          <Comments />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <EditPost />
      <div className="divider mt-0 ml-0"></div>
    </div>
  );
};

export default Post;
