import { baseApi } from "@/redux/baseApi";
import { IWar, ICreateWarInput, IJoinWarInput } from "./war.types";

const warApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Create a new war
    createWar: builder.mutation<IWar, ICreateWarInput>({
      query: (data) => ({
        url: "wars",
        method: "POST",
        data,
      }),
      transformResponse: (response: { data: IWar }) => response.data,
      invalidatesTags: ["war"],
    }),

    // User: Join a war
    joinWar: builder.mutation<IWar, IJoinWarInput>({
      query: (data) => ({
        url: "wars/join",
        method: "POST",
        data,
      }),
      transformResponse: (response: { data: IWar }) => response.data,
      invalidatesTags: ["war"],
    }),

    // Admin: Start a war
    startWar: builder.mutation<IWar, string>({
      query: (warId) => ({
        url: `wars/${warId}/start`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: IWar }) => response.data,
      invalidatesTags: ["war"],
    }),

    // Admin: Cancel a war
    cancelWar: builder.mutation<IWar, string>({
      query: (warId) => ({
        url: `wars/${warId}/cancel`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: IWar }) => response.data,
      invalidatesTags: ["war"],
    }),

    // Get war details
    getWarDetails: builder.query<IWar, string>({
      query: (warId) => ({
        url: `wars/${warId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: IWar }) => response.data,
      providesTags: ["war"],
    }),

    // Get wars created by current admin
    getMyCreatedWars: builder.query<IWar[], void>({
      query: () => ({
        url: "wars/my/created",
        method: "GET",
      }),
      transformResponse: (response: { data: IWar[] }) => response.data,
      providesTags: ["war"],
    }),

    // Get wars joined by current user
    getMyJoinedWars: builder.query<IWar[], void>({
      query: () => ({
        url: "wars/my/joined",
        method: "GET",
      }),
      transformResponse: (response: { data: IWar[] }) => response.data,
      providesTags: ["war"],
    }),

    // Admin: Remove a participant
    removeParticipant: builder.mutation<
      IWar,
      { warId: string; userId: string }
    >({
      query: ({ warId, userId }) => ({
        url: `wars/${warId}/participants/${userId}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: IWar }) => response.data,
      invalidatesTags: ["war"],
    }),
  }),
});

export const {
  useCreateWarMutation,
  useJoinWarMutation,
  useStartWarMutation,
  useCancelWarMutation,
  useGetWarDetailsQuery,
  useGetMyCreatedWarsQuery,
  useGetMyJoinedWarsQuery,
  useRemoveParticipantMutation,
} = warApi;
