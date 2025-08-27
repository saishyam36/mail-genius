import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const onChange = (event) => {
      setValue(event.matches);
    };

    // Make sure window is defined (for server-side rendering environments)
    if (typeof window !== 'undefined') {
      const result = window.matchMedia(query);
      result.addEventListener('change', onChange);
      
      // Set the initial value
      setValue(result.matches);

      // Cleanup function to remove the listener
      return () => result.removeEventListener('change', onChange);
    }
  }, [query]);

  return value;
};
