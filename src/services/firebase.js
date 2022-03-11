import { firebase, FieldValue } from "../lib/firebase";

export const doesUsernameExist = async (username) => {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();
  // return result.docs.map((user) => user.data().length > 0);
  return result.docs.length > 0;
};

// get user from the firestore where userId === userId (passed from the auth)
export const getUserByUserId = async (userId) => {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return user;
};

export const getUserFollowedPhotos = async (userId, followingUserIds) => {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", followingUserIds)
    .get();

  const userFollowedPhotos = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const username = user[0].username;
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
};

export const getSuggestedProfiles = async (userId) => {
  const result = await firebase.firestore().collection("users").limit(10).get();
  const [{ following }] = await getUserByUserId(userId);
  return result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
};

export const updateUserFollowing = async (
  docId,
  profileId,
  isFollowingProfile
) => {
  await firebase
    .firestore()
    .collection("users")
    .doc(docId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId)
    });
};

export const updateFollowedUserFollowers = async (
  docId,
  followingUserId,
  isFollowingProfile
) => {
  await firebase
    .firestore()
    .collection("users")
    .doc(docId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(followingUserId)
        : FieldValue.arrayUnion(followingUserId)
    });
};

export const getUserByUsername = async (username) => {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return user.length > 0 ? user : false;
};

export const getUserPhotosByUsername = async (username) => {
  const [{ userId }] = await getUserByUsername(username);
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();
  const userPhotos = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));
  return userPhotos;
};

export const toggleFollow = async (
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileId,
  followingUserId
) => {
  await updateUserFollowing(activeUserDocId, profileId, isFollowingProfile);
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
};

export const isUserFollowingProfile = async (activeUsername, profileUserId) => {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", activeUsername)
    .where("following", "array-contains", profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return !!response.fullName;
};
