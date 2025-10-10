import { apiSlice } from "./apiSlice";
import { REPORTS_URL } from "@/utils/constants";


export const reportsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReports: builder.query({
            query: (params) => ({
                url: `${REPORTS_URL}/dashboard`,
                method: "GET",
                params,
            }),
            providesTags: ["Report"],
        }),
    }),
});

export const { useGetReportsQuery } = reportsApiSlice;