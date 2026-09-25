import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useAsyncData = (queryKey, loader, errorMessage = "Couldn't load data.") => {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey, queryFn: loader });

  const reload = useCallback(() => query.refetch(), [query]);

  const setData = (updater) => {
    queryClient.setQueryData(queryKey, (old) =>
      typeof updater === "function" ? updater(old) : updater,
    );
  };

  return {
    data: query.data ?? null,
    error: query.isError ? errorMessage : "",
    loading: query.isLoading,
    reload,
    setData,
  };
};

export default useAsyncData;
