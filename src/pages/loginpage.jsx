import React, { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation, useRouteMatch, useParams } from "react-router-dom";

export const Loginpage = ({
  // auth,
  // history,
  // location,
  authContext,
  ...props
}) => {

  useEffect(() => {
    // console.log("loginpage")
  },[])

  function useAuth() {
    return useContext(authContext);
  }

  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  
  let { from } = location.state || { from: { pathname: "/home" } };
  let login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };

  return (
    <div style={{ height: '100vh'}}>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>
        Log in
      </button>
    </div>
  );
}

export default Loginpage