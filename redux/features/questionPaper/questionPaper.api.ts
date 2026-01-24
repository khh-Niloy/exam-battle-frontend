import { baseApi } from "@/redux/baseApi";

export const questionPaperApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuestionPapers: builder.query({
      query: () => ({
        url: "/question-paper",
        method: "GET",
      }),
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["questionPaper"],
    }),
  }),
});

export const { useGetAllQuestionPapersQuery } = questionPaperApi;
