import { useEffect } from 'react';
const useEventListener = (ref, event, eventListener) => {
  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener(event, eventListener)
    return () => ref.current.removeEventListener(event, eventListener);
  }, [ref])
}

export default useEventListener
