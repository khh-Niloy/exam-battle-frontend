import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userRegister: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),
    getFriends: builder.query({
      query: () => ({
        url: "/user/friends",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["user"],
    }),
  }),
});

export const { useUserRegisterMutation, useGetFriendsQuery } = userApi;
