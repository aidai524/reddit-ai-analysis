import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSubreddits() {
  const { data, error } = useSWR('/api/get-subreddits', fetcher);

  return {
    subreddits: data,
    isLoading: !error && !data,
    isError: error
  };
}