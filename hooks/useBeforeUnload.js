// hooks/useBeforeUnload.js
import { useEffect } from 'react';

const useBeforeUnload = (shouldWarn, message) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
    };

    if (shouldWarn) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    

  }, [shouldWarn, message]);
};

export default useBeforeUnload;
