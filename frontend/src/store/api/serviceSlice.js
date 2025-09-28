import { apiSlice } from "./apiSlice";
import { SERVICE_URL } from "@/utils/constants";

export const serviceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createService: builder.mutation({
            query: (data) => ({
                url: `${SERVICE_URL}/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Services'],
        }),
        getServices: builder.query({
            query: () => ({
                url: `${SERVICE_URL}/`,
                method: 'GET',
            }),
            providesTags: ['Services'],
        }),
        getServiceById: builder.query({
            query: (id) => ({
                url: `${SERVICE_URL}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Services'],
        }),
        updateService: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SERVICE_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Services'],
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `${SERVICE_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Services'],
        }),
    }),
})

export const {
    useCreateServiceMutation,
    useGetServicesQuery,
    useGetServiceByIdQuery,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = serviceApiSlice;