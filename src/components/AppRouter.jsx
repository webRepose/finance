import { Route, Routes, Navigate } from "react-router-dom";
import React, { lazy, memo, Suspense } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "..";
import ErrorBoundary from "./ErrorBounds/ErrorBoundary";
const Preloader = lazy(() => import("./Preloaders/Preloader")),
  Menu = lazy(() => import("../main/home/Home")),
  Stats = lazy(() => import("../main/stats/Stats")),
  Category = lazy(() => import("../main/category/Category")),
  Login = lazy(() => import("../components/Login")),
  privatRoutes = [
    {
      path: "/",
      Component: Menu,
    },
    {
      path: "/category",
      Component: Category,
    },
    {
      path: "/stats",
      Component: Stats,
    },
  ],
  publicRoutes = [
    {
      path: "/login",
      Component: Login,
    },
  ];

const AppRouter = memo(() => {
  const [user] = useAuthState(auth);

  return user ? (
    <Routes>
      {privatRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<Preloader />}>
              <ErrorBoundary>
                <Component />
              </ErrorBoundary>
            </Suspense>
          }
        />
      ))}
      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  ) : (
    <Routes>
      {publicRoutes &&
        publicRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<Preloader />}>
                <ErrorBoundary>
                  <Component />
                </ErrorBoundary>
              </Suspense>
            }
          />
        ))}
      <Route path="*" element={<Navigate to={"/login"} replace />} />
    </Routes>
  );
});

export default AppRouter;
