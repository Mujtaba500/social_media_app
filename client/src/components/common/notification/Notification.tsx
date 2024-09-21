import { UserPlus, ThumbsUp, MessageCircle } from "lucide-react";
import { Notification_Props } from "../../../types";
import { ReactNode, useEffect, useState } from "react";

const Notification: React.FC<Notification_Props> = ({ notification }) => {
  const [Notification_atrs, setNotificationatrs] = useState<{
    text: string;
    icon: ReactNode | null;
  }>({
    text: "",
    icon: null,
  });

  useEffect(() => {
    notification.type === "FOLLOW" &&
      setNotificationatrs({
        text: "started following you",
        icon: <UserPlus size={32} className="text-green-300" />,
      });
    notification.type === "POST_LIKE" &&
      setNotificationatrs({
        text: "liked your post",
        icon: <ThumbsUp size={32} className="text-blue-300" />,
      });
    notification.type === "COMMENT" &&
      setNotificationatrs({
        text: "commented on your post",
        icon: <MessageCircle size={32} className="text-blue-300" />,
      });
  }, []);

  return (
    <>
      <div className="notification ">
        <div className="flex items-center gap-2 m-4 ">
          {Notification_atrs.icon}
          <div className="avatar placeholder">
            {notification.sentFrom.profilepic ? (
              <img
                src={`${notification.sentFrom?.profilepic}`}
                className="max-w-12 max-h-12 object-cover rounded-full"
              />
            ) : (
              <div className="bg-neutral text-neutral-content w-12 rounded-full">
                <span>{notification.sentFrom?.username?.slice(0, 1)}</span>
              </div>
            )}
          </div>
        </div>
        <p className="ml-4">
          <span className=" text-slate-200 text-lg font-bold">
            @{notification.sentFrom.username}
          </span>{" "}
          {Notification_atrs.text}
        </p>
        <div className="divider my-4 ml-0 "></div>
      </div>
    </>
  );
};

export default Notification;
