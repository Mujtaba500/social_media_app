import { useEffect } from "react";
import useGetNotifications from "../../../hooks/notification/useGetNotifications";
import Notification from "./Notification";
import { useRecoilValue, useSetRecoilState } from "recoil";
import notificationsState from "../../../global/Notifications";
import useWebSocket from "../../../hooks/useWebSocket";

const Notifications = () => {
  const { loading, getNotifications } = useGetNotifications();
  const setNotifications = useSetRecoilState(notificationsState);
  const notifications = useRecoilValue(notificationsState);

  useEffect(() => {
    const fetchNotifications = async () => {
      await getNotifications();
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const { currentWS } = useWebSocket();

    currentWS.onmessage = (e) => {
      const latestMessage = JSON.parse(e.data);
      if (latestMessage?.id) {
        setNotifications((prev) => [latestMessage, ...prev]);
      }
    };

    // CLEANUP
    return () => {
      if (currentWS) {
        currentWS.close();
      }
    };
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
