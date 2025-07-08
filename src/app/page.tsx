"use client";

import { useBasisTheory } from "@basis-theory/react-elements";
import dynamic from "next/dynamic";

const ClientWrapper = dynamic(
  () => import("@/components/ClientWrapper").then(mod => mod.ClientWrapper),
  { ssr: false }
);

export default function Home() {
  const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_PUB_API_KEY, {
    // TODO: remove this
    //_devMode: process.env.NEXT_PUBLIC_DEV_MODE === "true",
    useSameOriginApi: false,
  });

  return (
    <main>
      <ClientWrapper
        bt={bt}
        apiKey={process.env.NEXT_PUBLIC_PUB_API_KEY ?? ''}
        config={{
          apiBaseUrl: process.env.NEXT_PUBLIC_API_HOST,
          sdkBaseUrl: process.env.NEXT_PUBLIC_SDK_HOST,
        }}
      />
    </main>
  );
}
