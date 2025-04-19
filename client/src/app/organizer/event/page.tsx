"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/organizer/event/new");
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting to event creation page...</p>
    </div>
  );
}
