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
    searchUser: builder.query({
      query: (code: string) => ({
        url: `/user/search/${code}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    sendFriendRequest: builder.mutation({
      query: (receiverCode: string) => ({
        url: "/user/friend-request/send",
        method: "POST",
        data: { receiverCode },
      }),
      invalidatesTags: ["user"],
    }),
    getPendingRequests: builder.query({
      query: () => ({
        url: "/user/friend-request/pending",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["user"],
    }),
    acceptFriendRequest: builder.mutation({
      query: (senderId: string) => ({
        url: "/user/friend-request/accept",
        method: "POST",
        data: { senderId },
      }),
      invalidatesTags: ["user"],
    }),
    rejectFriendRequest: builder.mutation({
      query: (senderId: string) => ({
        url: "/user/friend-request/reject",
        method: "POST",
        data: { senderId },
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useUserRegisterMutation,
  useGetFriendsQuery,
  useSearchUserQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetPendingRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} = userApi;
