import { create } from "domain";
import { apiSlice } from "./apiSlice";
import { EMPLOYEE_URL } from "@/utils/constants";


export const employeeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createEmployee: builder.mutation({
            query: (data) => ({
                url: `${EMPLOYEE_URL}/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employees'],
        }),
        getEmployees: builder.query({
            query: () => ({
                url: `${EMPLOYEE_URL}/`,
                method: 'GET',
            }),
            providesTags: ['Employees'],
        }),
        getEmployeeById: builder.query({
            query: (id) => ({
                url: `${EMPLOYEE_URL}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Employees'],
        }),
        updateEmployee: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${EMPLOYEE_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Employees'],
        }),
        deleteEmployee: builder.mutation({
            query: (id) => ({
                url: `${EMPLOYEE_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Employees'],
        }),
    }),
});

export const {
    useCreateEmployeeMutation,
    useGetEmployeesQuery,
    useGetEmployeeByIdQuery,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeeApiSlice;