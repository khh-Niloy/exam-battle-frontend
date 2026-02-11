import { baseApi } from "@/redux/baseApi";

export const questionPaperApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuestionPapers: builder.query({
      query: () => ({
        url: "question-paper",
        method: "GET",
      }),
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["questionPaper"],
    }),
    getSingleQuestionPaper: builder.query({
      query: (id: string) => ({
        url: `question-paper/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["questionPaper"],
    }),
    getMyQuestionPapers: builder.query({
      query: () => ({
        url: "question-paper/my-papers",
        method: "GET",
      }),
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["questionPaper"],
    }),
    createQuestionPaper: builder.mutation({
      query: (data) => ({
        url: "question-paper/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["questionPaper"],
    }),
  }),
});

export const {
  useGetAllQuestionPapersQuery,
  useGetSingleQuestionPaperQuery,
  useGetMyQuestionPapersQuery,
  useCreateQuestionPaperMutation,
} = questionPaperApi;
