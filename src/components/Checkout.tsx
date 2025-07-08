"use client";

import testCards from "../data/test-cards.json";
import { useRef, useState } from "react";
import { Alert, Box, Button, Paper, Snackbar } from "@mui/material";
import { CardElement, ICardElement, useBasisTheory } from "@basis-theory/react-elements";
import { CardMenu } from "./CardMenu";
import { CheckoutSteps } from "./CheckoutSteps";

interface CheckoutProps {
  bt3ds: any;
}

export const Checkout = ({ bt3ds }: CheckoutProps) => {
  const { bt } = useBasisTheory();
  const cardRef = useRef<ICardElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  const [testNumber, setTestNumber] = useState(testCards.luhnValid[0].cardNumber);
  const [cardValue, setCardValue] = useState({});

  const [token, setToken] = useState<any>();
  const [session, setSession] = useState<any>();
  const [authentication, setAuthentication] = useState<any>();
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [challengeResult, setChallengeResult] = useState<any>();

  const [errorMsg, setErrorMsg] = useState("");
  const [displayError, setDisplayError] = useState(false);

  const setTestCard = async () => {
    clearCheckout();

    setCardValue({
      number: testNumber,
      expiration_month: 12,
      expiration_year: 2030,
      cvc: "1234",  // non-4-digit CVCs will be just cut off
    });
  };

  const checkout = async () => {
    try {
      // reset steps
      clearCheckout();
      setInProgress(true);

      // create token
      const token = await createToken();
      setActiveStep(1);

      // create 3ds session
      const session = await create3dsSession(token);
      setActiveStep(2);

      // authenticate session (backend)
      const authentication = await authenticate3dsSession(session);

      if (authentication.authentication_status === "challenge") {
        setActiveStep(3);

        await performChallenge(authentication, session);
        setActiveStep(4);

        await getChallengeResult(session);
      }

      setInProgress(false);
    } catch (e) {
      clearCheckout();
      cardRef.current?.clear();
      setInProgress(false);

      handleError(e);
    }
  };

  const checkoutWithRedirect = async () => {
    try {
      setInProgress(true);

      // create token
      const token = await createToken();
      
      // create 3ds session using new route
      const sessionResponse = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: token.id }),
      });

      setActiveStep(2);
      const session = await sessionResponse.json();
      setSession(session);

      // Handle 3DS redirect
      if (session.redirect_url) {
        const result = await handle3dsRedirect(session.redirect_url);
        
        if (result === 'success') {
          // get updated session after redirect
          const sessionResponse = await fetch(`/api/sessions/${session.id}`);
          const updatedSession = await sessionResponse.json();

          // set authentication
          setAuthentication(updatedSession.authentication);

          // session needed a challenge
          if (updatedSession.authentication.directory_status_code === "C") {
            // get challenge result
            setActiveStep(4);
            await getChallengeResult(updatedSession);
          }
        }
      }

      setInProgress(false);
    } catch (e) {
      setInProgress(false);
      handleError(e);
    }
  };

  const handle3dsRedirect = async (redirectUrl: string) => {
    return new Promise<string>((resolve, reject) => {
      // Add the API key to the redirect URL
      const urlWithApiKey = `${redirectUrl}${process.env.NEXT_PUBLIC_PUB_API_KEY}`;
      
      // Open popup window
      const popup = window.open(
        urlWithApiKey,
        '3ds-redirect',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('Popup blocked. Please allow popups for this site.'));
        return;
      }

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === '3ds-result') {
          console.log('3DS Result:', event.data.result);
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve(event.data.result);
        }
      };

      window.addEventListener('message', messageListener);

      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          console.log('3DS popup was closed');
          resolve('closed');
        }
      }, 1000);
    });
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
    return token;
  };

  const create3dsSession = async (token: any) => {
    if (token) {
      const session = await bt3ds.createSession({ tokenId: token.id });

      if (!session) throw new Error("3DS session creation failed");

      setSession(session);
      return session;
    } else {
      throw new Error("Token was not set. Cannot create 3DS session.");
    }
  };

  const authenticate3dsSession = async (session: any) => {
    const authResponse = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id }),
    });

    const authentication = await authResponse.json();

    if (!authentication) throw new Error("3DS session authentication failed");

    setAuthentication(authentication);
    return authentication;
  };

  const performChallenge = async (authentication: any, session: any) => {
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

  const getChallengeResult = async (session: any) => {
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

  const handleError = (error: any) => {
    console.log(error);

    if (error instanceof Error) setErrorMsg(error.message);
    else if (typeof error === "string") setErrorMsg(error);
    else setErrorMsg("An error occurred. Check console for more details");

    setDisplayError(true);
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
          sx={{ width: "100%", mb: 1 }}
          onClick={() => checkout()}
          disabled={inProgress}
        >
          {"Checkout With Iframe"}
        </Button>
        
        <Button
          variant="outlined"
          sx={{ width: "100%" }}
          onClick={() => checkoutWithRedirect()}
          disabled={inProgress}
        >
          {"Checkout With Redirection"}
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

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={displayError}
        autoHideDuration={6000}
        onClose={() => setDisplayError(false)}
      >
        <Alert
          onClose={() => setDisplayError(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};
