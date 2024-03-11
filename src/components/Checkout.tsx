"use client";

import { CardElement, useBasisTheory } from "@basis-theory/basis-theory-react";
import { Token } from "@basis-theory/basis-theory-js/types/models";
import { useRef, useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import { CardMenu } from "./CardMenu";
import { CheckoutSteps } from "./CheckoutSteps";

interface CheckoutProps {
  bt3ds: any;
}

export const Checkout = ({ bt3ds }: CheckoutProps) => {
  const { bt } = useBasisTheory();
  const cardRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  const [testNumber, setTestNumber] = useState("4200000000000002");
  const [cardValue, setCardValue] = useState({});

  const [token, setToken] = useState<Token>();
  const [session, setSession] = useState<any>();
  const [authentication, setAuthentication] = useState<any>();
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [challengeResult, setChallengeResult] = useState<any>();

  const setTestCard = async () => {
    clearCheckout();
  
    setCardValue({
      number: testNumber,
      expiration_month: 12,
      expiration_year: 2024,
      cvc: "123",
    });
  };

  const checkout = async () => {
    // reset steps
    clearCheckout();
    setInProgress(true);

    // create token
    await createToken();
    setActiveStep(1);

    // create 3ds session
    await create3dsSession();
    setActiveStep(2);

    // authenticate session (backend)
    await authenticate3dsSession();

    // check if challenge required
    if (authentication.authentication_status === "challenge") {
      setActiveStep(3);

      await performChallenge();
      setActiveStep(4);

      await getChallengeResult();
    }

    setInProgress(false);
  };

  const clearCheckout = async () => {
    setActiveStep(0);
    setToken(undefined);
    setSession(undefined);
    setAuthentication(undefined);
    setChallengeComplete(false);
    setChallengeResult(undefined);
  };

  const createToken = async () => {
    // create card token
    const token = await bt?.tokens.create({
      type: "card",
      data: cardRef.current,
    });

    if (!token) throw new Error("Token creation failed");

    setToken(token);
  };

  const create3dsSession = async () => {
    if (token) {
      const session = await bt3ds.createSession({ pan: token.id });

      if (!session) throw new Error("3DS session creation failed");

      setSession(session);
    } else {
      throw new Error("Token was not set. Cannot create 3DS session.");
    }
  };

  const authenticate3dsSession = async () => {
    const authResponse = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id }),
    });

    const authentication = await authResponse.json();

    if (!authentication) throw new Error("3DS session authentication failed");

    setAuthentication(authentication);
  };

  const performChallenge = async () => {
    const challenge = {
      acsChallengeUrl: authentication.acs_challenge_url,
      acsTransactionId: authentication.acs_transaction_id,
      sessionId: session.id,
      threeDSVersion: authentication.threeds_version,
    };

    // show challenge frame
    document.getElementById("challengeFrameContainer")?.classList.add("flex");
    const challengeCompletion = await bt3ds.startChallenge(challenge);

    // hide challenge frame
    document
      .getElementById("challengeFrameContainer")
      ?.classList.remove("flex");

    if (!challengeCompletion) throw new Error("Challenge completion failed");

    setChallengeComplete(true);
  };

  const getChallengeResult = async () => {
    const challengeResultResponse = await fetch(
      `/api/challenge-result?sessionId=${session.id}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const challengeResult = await challengeResultResponse.json();

    if (!challengeResult) throw new Error("Challenge result retrieval failed");

    setChallengeResult(challengeResult);
  };

  return (
    <Box sx={{ width: "600px" }}>
      <Box mb={2} width={"100%"}>
        <CardMenu onSelect={(cardNumber) => setTestNumber(cardNumber)} />

        <Button
          variant="contained"
          sx={{ mt: 2, width: "100%" }}
          onClick={() => setTestCard()}
          disabled={inProgress}
        >
          {"Set Card Value"}
        </Button>
      </Box>

      <Box mb={2}>
        <CardElement
          id="cardElement"
          ref={cardRef}
          value={cardValue}
          skipLuhnValidation={true}
        />
      </Box>

      <Box>
        <Button
          variant="contained"
          sx={{ width: "100%" }}
          onClick={() => checkout()}
          disabled={inProgress}
        >
          {"Checkout"}
        </Button>
      </Box>

      <Box mt={4}>
        <Paper elevation={3}>
          <Box p={2}>
            <CheckoutSteps
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              token={token}
              threeDSSession={session}
              authentication={authentication}
              challengeComplete={challengeComplete}
              challengeResult={challengeResult}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
