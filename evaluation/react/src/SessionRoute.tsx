import type {Session} from "wordle-lib";
import * as React from "react";
import {Navigate} from "react-router";

type ProtectedRouteProps = {
    session: Session | null;
    children: React.ReactNode;
};

export const ProtectedRoute = ({ session, children }: ProtectedRouteProps) => {
    if (session === null) {
        return <Navigate to="/" replace />;
    }

    return children;
};
