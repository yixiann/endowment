import { Loginpage } from '../pages/loginpage';
// import VerifyAccountPage from '../pages/VerifyAccount';
// import ResetPasswordPage from '../pages/ResetPassword';
// import VerifyResetPasswordPage from '../pages/VerifyResetPassword';
import React from "react"
// import RequireNewPwPage from '../pages/RequireNewPw';

const PublicRoutes = [
  {
    path: '/login',
    exact: true,
    component: Loginpage
  },
  // {
  //   path: '/verifyaccount',
  //   exact: true,
  //   component: VerifyAccountPage
  // },
  // {
  //   path: '/forgotPassword',
  //   exact: true,
  //   component: ResetPasswordPage
  // },
  // {
  //   path: '/forgotPasswordVerify',
  //   exact: true,
  //   component: VerifyResetPasswordPage
  // },
  // {
  //   path: '/requireNewPw',
  //   exact: true,
  //   component: RequireNewPwPage
  // }
];

const PrivateRoutes = [
  // {
  //   path: '/',
  //   exact: true,
  //   component: React.lazy(() => import("../pages/Dashboard"))
  // },
  // {
  //   path: '/notfound',
  //   exact: true,
  //   component: React.lazy(() => import("../pages/NotFound"))
  // },
  // {
  //   path: '/accessforbidden',
  //   exact: true,
  //   component: React.lazy(() => import("../pages/AccessForbiddenPage.jsx")),
  // },
  {
    path: '/home',
    exact: true,
    component: React.lazy(() => import("../pages/homepage.jsx")),
  },
  {
    path: '/about',
    exact: true,
    component: React.lazy(() => import("../pages/aboutpage.jsx")),
  },
  {
    path: '/login',
    exact: true,
    component: React.lazy(() => import("../pages/loginpage.jsx")),
  },
];

export { PublicRoutes, PrivateRoutes };