import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  refetchOnFocus: false,
  refetchOnReconnect: true,
  keepUnusedDataFor: 60,
  endpoints: () => ({}),
  tagTypes: ["user", "questionPaper", "battle", "war", "coaching"],
});
