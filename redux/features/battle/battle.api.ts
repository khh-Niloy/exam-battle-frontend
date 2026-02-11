import { baseApi } from "@/redux/baseApi";

const battleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBattleHistory: builder.query({
      query: () => ({
        url: "/battles/history",
        method: "GET",
      }),
      providesTags: ["battle"],
    }),
    saveBattleResult: builder.mutation({
      query: (data) => ({
        url: "/battles",
        method: "POST",
        data,
      }),
      invalidatesTags: ["battle"],
    }),
  }),
});

export const { useGetBattleHistoryQuery, useSaveBattleResultMutation } =
  battleApi;
