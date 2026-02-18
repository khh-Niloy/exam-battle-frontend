import { baseApi } from "@/redux/baseApi";

export const coachingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCoaching: builder.mutation({
      query: (data) => ({
        url: "/coaching/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["coaching"],
    }),
    joinCoaching: builder.mutation({
      query: (data) => ({
        url: "/coaching/join",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["coaching"],
    }),
    getMyCoaching: builder.query({
      query: () => ({
        url: "/coaching/my-coaching",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["coaching"],
    }),
    removeStudent: builder.mutation({
      query: (studentId) => ({
        url: `/coaching/remove-student/${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coaching"],
    }),
  }),
});

export const {
  useCreateCoachingMutation,
  useJoinCoachingMutation,
  useGetMyCoachingQuery,
  useRemoveStudentMutation,
} = coachingApi;
