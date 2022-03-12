import React from 'react';
import { authService } from "Instance";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const onLogout = () => {
    authService.signOut();
    navigate('/');
  };
  return (
    <>
      <button onClick={onLogout}>Log Out</button>
    </>
  );
};

export default Profile;