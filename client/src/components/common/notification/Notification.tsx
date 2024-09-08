import { UserPlus, ThumbsUp, MessageCircle } from "lucide-react";

const Notification = () => {
  return (
    <>
      <div className="notification ">
        <div className="flex items-center gap-2 m-4 ">
          <UserPlus size={32} className="text-green-300" />
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span className="">M</span>
            </div>
          </div>
        </div>
        <p className="ml-4">
          <span className=" text-slate-200 text-lg font-bold">@burnout</span>{" "}
          started following you
        </p>
        <div className="divider my-4 ml-0 "></div>
      </div>

      {/* liked post/comment */}
      <div className="notification ">
        <div className="flex items-center gap-2 m-4 ">
          <ThumbsUp size={32} className="text-blue-300" />
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span className="">M</span>
            </div>
          </div>
        </div>
        <p className="ml-4">
          <span className=" text-slate-200 text-lg font-bold">@burnout</span>{" "}
          liked your post
        </p>
        <div className="divider my-4 ml-0 "></div>
      </div>

      {/* comment on post */}
      <div className="notification ">
        <div className="flex items-center gap-2 m-4 ">
          <MessageCircle size={32} className="text-blue-300" />
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span className="">M</span>
            </div>
          </div>
        </div>
        <p className="ml-4">
          <span className=" text-slate-200 text-lg font-bold">@burnout</span>{" "}
          commented on your post
        </p>
        <div className="divider my-4 ml-0 "></div>
      </div>
    </>
  );
};

export default Notification;
