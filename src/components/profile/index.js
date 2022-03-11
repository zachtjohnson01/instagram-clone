import { useReducer, useEffect } from "react";
import {
  getUserByUsername,
  getUserPhotosByUsername
} from "../../services/firebase";
import Header from "./header";
import Photos from "./photos";

const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  profile: {},
  photosCollection: [],
  followerCount: 0
};

const Profile = ({ username }) => {
  const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    const getProfileInfoAndPhotos = async () => {
      const [{ ...user }] = await getUserByUsername(username);
      const photos = await getUserPhotosByUsername(username);
      dispatch({
        profile: user,
        photosCollection: photos,
        followerCount: user.followers.length
      });
    };
    getProfileInfoAndPhotos();
  }, [username]);
  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch}
        username={username}
      />
      <Photos photos={photosCollection} />
    </>
  );
};

export default Profile;
