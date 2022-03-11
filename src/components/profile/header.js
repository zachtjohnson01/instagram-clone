import { useState, useEffect } from "react";
import useUser from "../../hooks/use-user";
import Skeleton from "react-loading-skeleton";
import { isUserFollowingProfile, toggleFollow } from "../../services/firebase";

const Header = ({
  photosCount,
  followerCount,
  setFollowerCount,
  username: profileUsername,
  profile: { docId: profileDocId, userId: profileUserId, fullName, following }
}) => {
  const { user } = useUser();
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const activeBtnFollow =
    user && user.username && user.username !== profileUsername;

  const handleToggleFollow = async () => {
    setIsFollowingProfile(!isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
    });
    await toggleFollow(
      isFollowingProfile,
      user.docId,
      profileDocId,
      profileUserId,
      user.userId
    );
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      );
      if (user.username && profileUserId) {
        setIsFollowingProfile(isFollowing);
      }
    };
    isLoggedInUserFollowingProfile();
  }, [user.username, profileUserId]);

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center">
        <img
          className="rounded-full h-40 w-40 flex"
          alt={`${profileUsername} profile`}
          src={`/images/avatars/${profileUsername}.jpg`}
        />
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className="bg-blue-500 font-bold text-sm rounded text-white w-20 h-8"
              type="button"
              onClick={handleToggleFollow}
            >
              {isFollowingProfile ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
        <div className="container flex mt-4">
          {followerCount === undefined || following === undefined ? (
            <Skeleton count={1} height={24} width={677} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">{photosCount}</span> photos
              </p>
              <p className="mr-10">
                <span className="font-bold">{followerCount}</span>{" "}
                {followerCount === 1 ? "follower" : "followers"}
              </p>
              <p className="mr-10">
                <span className="font-bold">{following.length}</span> following
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          {fullName === undefined ? (
            <Skeleton count={1} height={24} width={677} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-medium">{fullName}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
