import { useEffect, useState } from "react";

const baseUrl = 'http://localhost:3000';

export default function useFetch<T, R = T>(url: string, options?: RequestInit): { data: R | null, isLoading: boolean, error: string | null } {
  const [data, setData] = useState<R | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl + url, options);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(String(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading, error };
}