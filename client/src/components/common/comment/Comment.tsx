import { Pencil, Trash2 } from "lucide-react";
import DialogEditComment from "./DialogEditComment";
import React from "react";
import { CommentProps } from "../../../types";

const Comment: React.FC<CommentProps> = () => {
  return (
    <>
      <div className="flex my-4 ">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span className="">S</span>
          </div>
        </div>
        <div className="ml-2 w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-slate-200 text-lg  font-bold ">
                Portgas D Ace
              </h1>
              <p>@ace123</p>
            </div>
            <div className="flex">
              <Pencil
                size={20}
                className="cursor-pointer mr-2 hover:text-blue-400"
                onClick={() => {
                  const modal = document.getElementById(
                    "editCommentModal"
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
          <p className="text-white">Hello From another world</p>
        </div>
        <DialogEditComment />
      </div>
    </>
  );
};

export default Comment;
