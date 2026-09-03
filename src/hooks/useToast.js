/* ─────────────────────────────────────────────
   Kısa bilgilendirme mesajları için basit hook.
   ───────────────────────────────────────────── */

import { useState, useCallback, useRef } from "react";

const useToast = (duration = 2000) => {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  const notify = useCallback(
    (text) => {
      clearTimeout(timerRef.current);
      setMessage(text);
      setShow(true);
      timerRef.current = setTimeout(() => setShow(false), duration);
    },
    [duration],
  );

  return { message, show, notify };
};

export default useToast;
