import { useState, useEffect, useContext } from "react";
import { getUserByUserId, getUserFollowedPhotos } from "../services/firebase";
import UserContext from "../context/user";

const useFollowedUsersPhotos = () => {
  const [photos, setPhotos] = useState(null);
  const { user } = useContext(UserContext);
  const userId = user?.uid;

  useEffect(() => {
    const getTimelinePhotos = async () => {
      const followingUserIds = await getUserByUserId(userId);

      if (followingUserIds && followingUserIds[0].following.length > 0) {
        const followedUserPhotos = await getUserFollowedPhotos(
          userId,
          followingUserIds[0].following
        );
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(followedUserPhotos);
      }
    };

    getTimelinePhotos();
  }, [userId]);
  return { photos };
};

export default useFollowedUsersPhotos;
