import { useEffect } from "react";
import useGetNotifications from "../../../hooks/notification/useGetNotifications";
import Notification from "./Notification";
import { useRecoilValue } from "recoil";
import notificationsState from "../../../global/Notifications";

const Notifications = () => {
  const { loading, getNotifications } = useGetNotifications();
  const notifications = useRecoilValue(notificationsState);

  useEffect(() => {
    const fetchNotifications = async () => {
      await getNotifications();
    };
    fetchNotifications();
  }, []);

  const mappedNotifications = notifications.map((notification) => {
    return <Notification notification={notification} key={notification.id} />;
  });

  return (
    <>
      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        mappedNotifications
      )}
    </>
  );
};

export default Notifications;
