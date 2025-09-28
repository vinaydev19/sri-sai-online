import { AUTH_URL } from "@/utils/constants";
import { apiSlice } from "./apiSlice";



export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: 'POST',
            }),
            invalidatesTags: ['Auth', 'User'],
        }),
        refreshToken: builder.query({
            query: () => ({
                url: `${AUTH_URL}/refresh-token`,
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),
        getCurrentUser: builder.query({
            query: () => ({
                url: `${AUTH_URL}/me`,
                method: 'GET',
            }),
            providesTags: ['Auth', 'User'],
        }),
        updateAccountDetails: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/update`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Auth', 'User'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useRefreshTokenQuery,
    useGetCurrentUserQuery,
    useUpdateAccountDetailsMutation,
} = authApiSlice;