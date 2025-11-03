import { QueryClient, type QueryFunction } from "@tanstack/react-query";

type HeadersInit = Headers | string[][] | Record<string, string>;

// Base URL for API requests
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

function joinApiUrl(base: string, endpoint: string): string {
  // If endpoint is absolute, return as-is
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;

  const normBase = base.replace(/\/$/, ''); // remove trailing /
  const normPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!normBase) return normPath; // no base provided

  // Avoid double /api when base already includes /api and endpoint starts with /api
  if (normBase.endsWith('/api') && normPath.startsWith('/api/')) {
    return `${normBase}${normPath.substring(4)}`; // drop leading /api from path
  }

  return `${normBase}${normPath}`;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    const resClone = res.clone(); // Clone the response
    try {
      const errorData = await resClone.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      try {
        const text = await res.text();
        if (text) errorMessage = text;
      } catch (e2) {
        // Ignore error from reading text
      }
    }
    throw new Error(errorMessage);
  }
}

/**
 * Make an API request with proper error handling and content type
 */
export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown,
): Promise<Response> {
  // Ensure endpoint starts with a slash
  const url = joinApiUrl(API_BASE_URL, endpoint);

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  
  if (data) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
