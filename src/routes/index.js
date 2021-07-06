import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { PrivateRoutes } from './routes'

const PrivateRoute = ({ children, authContext, ...rest }) => {
  var auth = useContext(authContext)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function NotFoundRouteHandling({ children, ...rest }) {

  console.log("TEST 2")

  const routes = PrivateRoutes.map((item)=>(item.path))

  console.log("TEST3", routes)

  return (
    <Route {...rest}
      // render={({ location }) => 
        // (<Redirect to={{ pathname: '/home', state: { from: location } }} />)}
        render={({ location }) => {
          console.log("TEST",location.pathname)
          console.log("TEST4",!routes.includes(location.pathname))
          return  !routes.includes(location.pathname) && <Redirect to={{ pathname: '/login', state: { from: location } }} />
          }
        }
    />
  )
}

export {PrivateRoute, NotFoundRouteHandling}

// const NotFoundRouteHandling = ({ loggedInUser, ...rest }) => {
//   return (
//     <Route {...rest}
//       render={({ location }) => loggedInUser ?
//         (<NotFound uri={location.pathname} />) :
//         (<Redirect to={{ pathname: '/login', state: { from: location } }} />)}
//     />
//   )
// }



// import React from 'react';
// import { Redirect, Route, useLocation } from 'react-router-dom';
// // import { NotFound } from '../pages';
// import { PublicRoutes, PrivateRoutes } from './routes';

// const PublicRouteHandling = ({ children, component, loggedInUser, ...rest }) => {
//   const location = useLocation();

//   let afterLoginRedirectUrl = '/';

//   const loc = {
//     "pathname": "/",
//     "search": "",
//     "hash": ""
//   }

//   const { from } = location.state ? location.state : loc;
//   if (from) {
//     afterLoginRedirectUrl = from.pathname;
//   }

//   // if (location.state && location.state.from && loggedInUser) {
//   //   afterLoginRedirectUrl = loggedInUser.userInfo.pageNames[0];
//   // }

//   if (loggedInUser) {
//     console.log("PAGE",loggedInUser.userInfo.pageNames)
//     afterLoginRedirectUrl = loggedInUser.userInfo.pageNames[0];
//   }

//   return (
//     <Route {...rest}
//       render={() => !loggedInUser ?
//         (children ? children : component) :
//         <Redirect to={{ pathname: afterLoginRedirectUrl }} />}
//     />
//   )
// };


// const PrivateRouteHandling = ({ children, component, loggedInUser, ...rest }) => {
//   // Main wrapper already handle the check if the user is logged in or not
//   return (
//     <Route {...rest} 
//       render={() => (children ? children : component)} 
//     />
//   )
// };


// const PublicRouter = PublicRouteHandling;
// const PrivateRouter = PrivateRouteHandling;
// const NotFoundRouter = NotFoundRouteHandling;

// export { PublicRoutes, PublicRouter, PrivateRoutes, PrivateRouter, NotFoundRouter };
