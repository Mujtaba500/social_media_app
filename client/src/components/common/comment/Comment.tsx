import { Pencil, Trash2 } from "lucide-react";
import DialogEditComment from "./DialogEditComment";
import React from "react";
import { CommentProps } from "../../../types";

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <>
      <div className="flex my-4 ">
        <div className="avatar placeholder">
          {comment.author.profilepic ? (
            <img
              src={`${comment?.author?.profilepic}`}
              className="w-12 rounded-full"
            />
          ) : (
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span>{comment?.author?.fullName.slice(0, 1)}</span>
            </div>
          )}
        </div>
        <div className="ml-2 w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-slate-200 text-lg  font-bold ">
                {comment.author.fullName}
              </h1>
              <p>@{comment.author.username}</p>
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
          <p className="text-white">{comment.body}</p>
        </div>
        <DialogEditComment />
      </div>
    </>
  );
};

export default Comment;
