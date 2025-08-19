// app/unsubscribe/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from '@/components/ui/button'
import Image from "next/image"
import Link from 'next/link'

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
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.log("Error unsubscribing user:", err);
        setStatus("error");
      }
    };

    unsubscribeUser();
  }, [uid]);

  if (status === "loading") {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container flex h-screen items-center justify-center fixed z-40 w-full bg-white"
      >
        <div className="text-center">
          <Link href="/">
            <Image src="/logo.svg" alt="LIA Logo" width={48} height={48} className="mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold mb-4">Unsubscribing...</h1>
          <p className="text-muted-foreground mb-6">Please wait while we process your request.</p>
        </div>
      </motion.div>
    )
  };
  if (status === "success") {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container flex h-screen items-center justify-center fixed z-40 w-full bg-white"
      >
        <div className="text-center">
          <Link href="/">
            <Image src="/logo.svg" alt="LIA Logo" width={48} height={48} className="mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold mb-4">Success...</h1>
          <p className="text-muted-foreground mb-6">You have been unsubscribed successfully 🎉</p>
          <Button asChild variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    )
  }
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container flex h-screen items-center justify-center fixed z-40 w-full bg-white"
      >
        <div className="text-center">
          <Link href="/">
            <Image src="/logo.svg" alt="LIA Logo" width={48} height={48} className="mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Failed...</h1>
          <p className="text-muted-foreground mb-6">Unsubscribe failed. Please contact <a href="mailto:support@getlia.live" className="text-primary">support</a>.</p>
          <Button asChild variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </motion.div>
  );
}