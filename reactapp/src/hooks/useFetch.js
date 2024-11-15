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
    // Include fetchFunction in the dependency array to ensure it's updated correctly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFunction, ...dependencies]); // Spread additional dependencies dynamically.

  return { data, error };
};

export default useFetch;
