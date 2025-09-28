import { BASE_URL } from '@/utils/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        // try to get a new token
        const refreshResult = await baseQuery('/auth/refresh-token', api, extraOptions);
        if (refreshResult?.data) {
            // store the new token
            // retry the initial query
            result = await baseQuery(args, api, extraOptions);
        } else {
            if (refreshResult?.error?.status === 403) {
                // redirect to login
                window.location.href = '/login';
            }
        }
    }

    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', "Employees", "Services", "Customers", "Auth"],
    endpoints: builder => ({}),
    keepUnusedDataFor: 60 * 60 * 24 * 7, // 7 days
})