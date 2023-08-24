import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from '../index';
import { Link } from 'react-router-dom';

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex items-center">
      {authUser ? (
        <div className="flex items-center gap-x-2">
          <Link class="font-medium text-white/[.8] hover:text-white sm:py-6 ">{`Hey ${authUser.email}!`}</Link>
          <Link class ="flex items-center gap-x-2 font-medium text-white/[.8] hover:text-white sm:my-6 sm:pl-6" to="/login" onClick={userSignOut}>Sign Out</Link>
        </div>
      ) : (
        <Link class="flex items-center gap-x-2 font-medium text-white/[.8] hover:text-white sm:border-l sm:border-white/[.3] sm:my-6 sm:pl-6" to="/login">
<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
</svg>
Log in
</Link>
      )}
    </div>
  );
};

export default AuthDetails;
