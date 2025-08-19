// app/unsubscribe/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!uid) {
      setStatus("error");
      return;
    }

    const unsubscribeUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/unsubscribe?uid=${uid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    unsubscribeUser();
  }, [uid]);

  if (status === "loading") return <p>Processing your unsubscribe request...</p>;
  if (status === "success") return <p>You have been unsubscribed successfully 🎉</p>;
  return <p>Unsubscribe failed. Please contact support.</p>;
}