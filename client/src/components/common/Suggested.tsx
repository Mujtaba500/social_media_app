import { useEffect } from "react";
import useGetSuggested from "../../hooks/useGetSuggested";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import UserCard from "./UserCard";
import { useRecoilValue } from "recoil";
import suggestedUsersState from "../../global/SuggestedUsers";

const Suggested = () => {
  const { getSuggestedUsers, loading } = useGetSuggested();
  const suggestedUsers = useRecoilValue(suggestedUsersState);

  useEffect(() => {
    const getSuggested = async () => {
      await getSuggestedUsers();
    };
    getSuggested();
  }, []);

  const mappedusers = suggestedUsers.map((user) => {
    return (
      <li key={user.id}>
        <a className="text-white rounded-full ">
          <UserCard user={user} />
        </a>
      </li>
    );
  });

  return (
    <>
      {loading ? (
        <div className="min-h-full bg-base-200 ">
          <div>
            <ul className="menu text-base-content p-12">
              <RightPanelSkeleton />
            </ul>
          </div>
        </div>
      ) : (
        <div className="min-h-full bg-base-200 ">
          <div>
            <ul className="menu text-base-content p-4 gap-5">{mappedusers}</ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Suggested;
