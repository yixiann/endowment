import React, { useContext, createContext, useState, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation, useRouteMatch, useParams } from "react-router-dom";
import './App.css';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.css';
import Loginpage from "./pages/loginpage";
import MainLayout from "./layouts/mainlayout";
import { PrivateRoutes } from "./routes";

export default function app() {

  window.onbeforeunload = function() {
    console.log("TEST")
  };

  return (
    <ProvideAuth>
      <Router>
          {/* <AuthButton />

          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul> */}
        <Switch>
          <Route path="/public">
            <PublicPage />
          </Route>

          <Route path="/login">
            {/* <LoginPage /> */}
            <Loginpage
              authContext={authContext}
            />
          </Route>


          {/* <PrivateRoute path="/protected">
            <ProtectedPage />
          </PrivateRoute> */}

          <MainLayout
            authContext={authContext}
          >
            {
              PrivateRoutes.map(route => {
                return (
                // <PrivateRouter key={route.path} exact={route.exact} path={route.path}>                  
                //   <Suspense fallback={<div>{global.loading}...</div>}>
                //     <route.component language={language} />
                //   </Suspense>
                // </PrivateRouter>
                <PrivateRoute path={route.path}>
                  <Suspense fallback={<div>loading...</div>}>
                    <route.component/>
                  </Suspense>
                </PrivateRoute>
              )}
              )
            }
          </MainLayout>

        </Switch>
      </Router>
    </ProvideAuth>
  );
}

const authContext = createContext();

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

// Public page
function PublicPage(){
  return (
    <p>hello</p>
  )
}

// SHIFT TO ROUTES
function useAuth() {
  return useContext(authContext);
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
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