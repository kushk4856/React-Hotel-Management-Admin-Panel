/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProtectedRoute = ({ children }) => {
  //1. load the authenticated user
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  //2. If there is no authenticated user, redirect to the /login page
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  //3. While loading , show  a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  //4.  If there is a user, render the app
  if (isAuthenticated) return children;
  
  //5. Fallback for unauthenticated state (prevents undefined return)
  return null;
};

export default ProtectedRoute;
