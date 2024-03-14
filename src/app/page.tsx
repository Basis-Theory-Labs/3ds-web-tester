"use client";

import { BasisTheoryProvider, useBasisTheory } from "@basis-theory/basis-theory-react";
import { BasisTheory3ds } from "@basis-theory/3ds-web";
import { Checkout } from "@/components/Checkout";

export default function Home() {
  const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_PUB_API_KEY, {
    elements: true,
    elementsClientUrl: `${process.env.NEXT_PUBLIC_JS_HOST}/elements`,
    elementsBaseUrl: `${process.env.NEXT_PUBLIC_JS_HOST}/hosted-elements`,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_HOST,
  });

  const bt3ds = BasisTheory3ds(process.env.NEXT_PUBLIC_PUB_API_KEY ?? '', {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_HOST,
  });

  return (
    <main>
      <BasisTheoryProvider bt={bt}>
        <Checkout bt3ds={bt3ds} />
      </BasisTheoryProvider>
    </main>
  );
}
