import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, lgin, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (lgin) {
          return <Component {...rest} {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/sign",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
