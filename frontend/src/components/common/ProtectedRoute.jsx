import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useGetCurrentUserQuery } from '@/store/api/authSlice';
import { getUser } from '@/store/slices/userSlice';
import Loading from '@/components/common/Loading';

function ProtectedRoute() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  // Fetch current user to verify token
  const { data, isLoading, isError } = useGetCurrentUserQuery();

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(getUser(data.data.user));
    }
  }, [data, dispatch]);

  if (isLoading) return <Loading />; // show loader while checking

  // If error or no user, redirect to login
  if (isError || (!user && !data?.data?.user)) return <Navigate to="/login" />;

  return <Outlet />; // allow child routes
}

export default ProtectedRoute;
