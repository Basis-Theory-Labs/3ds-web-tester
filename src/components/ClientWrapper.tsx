import { BasisTheoryElements, BasisTheoryProvider } from "@basis-theory/react-elements";
import { BasisTheory3ds } from "@basis-theory/web-threeds";
import { Checkout } from "./Checkout";

interface ClientWrapperProps {
  bt?: BasisTheoryElements;
  apiKey: string;
  config: {
    apiBaseUrl?: string;
    sdkBaseUrl?: string;
  };
}

export function ClientWrapper({ bt, apiKey, config }: ClientWrapperProps) {
  const bt3ds = BasisTheory3ds(apiKey, config);

  return (
    <BasisTheoryProvider bt={bt}>
      <Checkout bt3ds={bt3ds} />
    </BasisTheoryProvider>
  );
} 