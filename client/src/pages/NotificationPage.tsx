import { Trash2 } from "lucide-react";
import Notifications from "../components/common/notification/Notifications";
import useDeleteNotifications from "../hooks/notification/useDeleteNotifications";

const NotificationPage = () => {
  const { deleteNotifications, loading } = useDeleteNotifications();

  const handleDelete = async () => {
    await deleteNotifications();
  };

  return (
    <>
      <div className="notifications w-full h-full  mt-12">
        <div className="flex justify-between  items-center">
          <h1 className="text-slate-200 text-lg ml-5 font-bold ">
            Notifications
          </h1>
          <div className="dropdown">
            <Trash2
              size={20}
              className="cursor-pointer hover:text-red-600 relative mr-5 "
              tabIndex={0}
              role="button"
            />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li className="text-center">
                {loading ? (
                  <div className="text-center">
                    <span className="loading loading-spinner loading-sm"></span>
                  </div>
                ) : (
                  <a onClick={handleDelete}>Delete all notifications</a>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="divider my-4 ml-0 "></div>
        <Notifications />
      </div>
    </>
  );
};

export default NotificationPage;
