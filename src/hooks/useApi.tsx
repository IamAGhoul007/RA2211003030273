
import { useState, useEffect, useCallback, useRef } from "react";
import { ApiResponse } from "@/types";
import { toast } from "sonner";

interface FetchOptions {
  initialFetch?: boolean;
  pollingInterval?: number | null;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  url: string,
  options: FetchOptions = { initialFetch: true, pollingInterval: null }
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const pollingRef = useRef<number | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      } else {
        toast.error(`Error fetching data: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  // Setup polling if interval is specified
  useEffect(() => {
    if (options.pollingInterval) {
      pollingRef.current = window.setInterval(() => {
        fetchData();
      }, options.pollingInterval);
    }
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [options.pollingInterval, fetchData]);
  
  // Initial fetch
  useEffect(() => {
    if (options.initialFetch) {
      fetchData();
    }
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [options.initialFetch, fetchData]);
  
  return { data, isLoading, error, refetch };
}
