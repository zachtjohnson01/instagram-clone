import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import UserProfile from "../components/profile";
import { getUserByUsername } from "../services/firebase";
import * as ROUTES from "../constants/routes";

const Profile = () => {
  const { username } = useParams();
  const [userExists, setUserExists] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserExistsToLoadProfile = async () => {
      const doesUserExist = await getUserByUsername(username);
      if (!doesUserExist) {
        navigate(ROUTES.NOT_FOUND);
      } else {
        setUserExists(true);
      }
    };
    checkUserExistsToLoadProfile();
  }, [username, navigate]);

  return (
    <>
      {userExists ? (
        <div>
          <Header />
          <div className="mx-auto max-w-screen-lg">
            <UserProfile username={username} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Profile;
