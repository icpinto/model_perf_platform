import { useState, useEffect } from "react";

const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFunction();
        setData(result.data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, dependencies);

  return { data, error };
};

export default useFetch;

