import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useGetCurrentUserQuery } from '@/store/api/authSlice';
import { getUser } from '@/store/slices/userSlice';
import Loading from '@/components/common/Loading';

function ProtectedRoute() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  const { data, isLoading, isError } = useGetCurrentUserQuery();

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(getUser(data.data.user));
    }
  }, [data, dispatch]);

  if (isLoading) return <Loading />; 

  if (isError || (!user && !data?.data?.user)) return <Navigate to="/login" />;

  return <Outlet />; 
}

export default ProtectedRoute;
