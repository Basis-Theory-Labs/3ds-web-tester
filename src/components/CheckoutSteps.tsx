import * as React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from "@mui/material";

interface CheckoutStepsProps {
  token: any;
  threeDSSession: any;
  authentication: any;
  challengeComplete: boolean;
  challengeResult: any;
  activeStep: number;
  setActiveStep: (value: number) => void;
}

export const CheckoutSteps = ({
  activeStep,
  setActiveStep,
  token,
  threeDSSession,
  authentication,
  challengeComplete,
  challengeResult,
}: CheckoutStepsProps) => {
  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={"Create Token"}>
          <StepLabel optional={token !== undefined ? token.id : ""}>
            {token !== undefined ? "Token Created" : "Create Token"}
          </StepLabel>
        </Step>

        <Step key={"Create 3DS Session"}>
          <StepLabel
            optional={threeDSSession !== undefined ? threeDSSession.id : ""}
            sx={{ color: "white" }}
          >
            {threeDSSession !== undefined
              ? "3DS Session Created"
              : "Create 3DS Session"}
          </StepLabel>
        </Step>

        <Step
          key={"Authenticate Session"}
          completed={authentication !== undefined ? true : false}
        >
          <StepLabel>
            {authentication !== undefined
              ? "Session Authenticated"
              : "Authenticate 3DS Session"}
          </StepLabel>
          <StepContent>
            {authentication !== undefined ? (
              <Typography component="div">
                <pre>
                  <code>{JSON.stringify(authentication, null, 2)}</code>
                </pre>
              </Typography>
            ) : (
              <></>
            )}
          </StepContent>
        </Step>

        <Step key={"Start Challenge"} completed={challengeComplete}>
          <StepLabel>
            {!challengeComplete ? "Perform Challenge" : "Challenge Completed"}
          </StepLabel>
        </Step>

        <Step
          key={"Get Challenge Result"}
          completed={challengeResult !== undefined ? true : false}
        >
          <StepLabel>
            {challengeResult !== undefined
              ? "Challenge Result Retrieved"
              : "Get Challenge Result"}
          </StepLabel>
          <StepContent>
            {challengeResult !== undefined ? (
              <Typography component="div">
                <pre>
                  <code>{JSON.stringify(challengeResult, null, 2)}</code>
                </pre>
              </Typography>
            ) : (
              <></>
            )}
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};
