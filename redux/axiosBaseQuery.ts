import { axiosInstance } from "@/lib/axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const errorData = err.response?.data as any;

      // Extract user-friendly error message
      let errorMessage = "An unexpected error occurred";
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Handle network errors
      if (!err.response) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      }

      // Handle specific status codes
      if (err.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (err.response?.status === 403) {
        errorMessage = "You do not have permission to perform this action.";
      } else if (err.response?.status === 404) {
        errorMessage = "The requested resource was not found.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      return {
        error: {
          status: err.response?.status || 500,
          data: {
            message: errorMessage,
            ...(errorData || {}),
          },
        },
      };
    }
  };
