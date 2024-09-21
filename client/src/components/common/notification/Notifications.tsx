import useGetNotifications from "../../../hooks/notification/useGetNotifications";
import Notification from "./Notification";

const Notifications = () => {
  const { loading, notifications } = useGetNotifications();

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
