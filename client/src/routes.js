import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { CreatePage } from "./pages/CreatePage";
import { AuthPage } from "./pages/AuthPage";
import { Posts } from "./pages/Posts";
import { PersonalPage } from "./pages/PersonalPage";
import SinglePost from "./pages/SinglePost";

export const useRoutes = (isAuthenticated, role) => {
  console.log(isAuthenticated, role);
  // if (isAuthenticated && role === "admin") {
  //   return (
  //     <Switch>
  //       <Route path="/create" exact>
  //         <CreatePage />
  //       </Route>
  //       <Route path="/posts" exact>
  //         <Posts />
  //       </Route>
  //     </Switch>
  //   );
  // }

  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/create" exact>
          <CreatePage />
        </Route>
        <Route path="/user/:id" exact>
          <PersonalPage />
        </Route>
        <Route path="/posts" exact>
          <Posts />
        </Route>
        <Route path="/posts/:id" exact>
          <SinglePost />
        </Route>
        <Route path="/">
          <Posts />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route path="/posts/:id" exact>
        <SinglePost />
      </Route>
      <Route path="/">
        <Posts />
      </Route>
    </Switch>
  );
};
