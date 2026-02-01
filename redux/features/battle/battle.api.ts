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
    }),
});

export const { useGetBattleHistoryQuery } = battleApi;
