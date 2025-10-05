import { CUSTOMER_URL } from "@/utils/constants";
import { apiSlice } from "./apiSlice";


export const customersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCustomer: builder.mutation({
            query: (data) => ({
                url: `${CUSTOMER_URL}/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Customers'],
        }),
        getCustomers: builder.query({
            query: () => ({
                url: `${CUSTOMER_URL}/`,
                method: 'GET',
            }),
            providesTags: ['Customers'],
        }),
        getCustomerById: builder.query({
            query: (id) => ({
                url: `${CUSTOMER_URL}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Customers'],
        }),
        updateCustomer: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${CUSTOMER_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Customers'],
        }),
        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `${CUSTOMER_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Customers'],
        }),
        nextCustomerId: builder.query({
            query: () => ({
                url: `${CUSTOMER_URL}/next-id`,
                method: 'GET',
            }),
            providesTags: ['Customers'],
        }),
    }),
});

export const {
    useCreateCustomerMutation,
    useGetCustomersQuery,
    useGetCustomerByIdQuery,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    useNextCustomerIdQuery,
    useLazyNextCustomerIdQuery,
} = customersApiSlice;