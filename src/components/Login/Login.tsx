import { Box, Button, CircularProgress, Input } from "@mui/material";
import { app, auth } from "../../firebase";
import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import {
  getAuth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import "firebase/compat/auth";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

declare global {
  interface Window {
    recaptchaVerifier: any;
    grecaptcha: any;
    captchaId: string;
  }
}

enum STEPS {
  PHONE,
  OTP,
}

export const Login = ({ setUser }: { setUser: (user: any) => void }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(STEPS.PHONE);
  const [verifying, setVerifying] = useState(false);

  const confirmationResult = useRef<any>(null);

  const initiateLogin = async (e: FormEvent) => {
    e.preventDefault();
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: async (response: any) => {
          setVerifying(true);
          console.log(response);
          signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
            .then((newConfirmationResult) => {
              confirmationResult.current = newConfirmationResult;
              setStep(STEPS.OTP);
            })
            .catch((error) => {
              console.error(error);
              toast.error("Error sending code");
              window.recaptchaVerifier.clear();
            })
            .finally(() => setVerifying(false));
        },
      },
      auth
    );
    window.captchaId = await window.recaptchaVerifier.verify();
  };

  const submitOtp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const codeResult = await confirmationResult.current.confirm(otp);
      const user = codeResult.user;
      setUser(user);
    } catch (e) {
      console.error(e);
      toast.error("Wrong code");
    }
  };

  return (
    <Box>
      {step === STEPS.PHONE ? (
        <form onSubmit={initiateLogin}>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Box marginTop={2}>
            {verifying ? (
              <CircularProgress />
            ) : (
              <button type="submit" id="sign-in-button">
                Login
              </button>
            )}
          </Box>
        </form>
      ) : (
        <form onSubmit={submitOtp}>
          <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Box marginTop={2}>
            <button type="submit">Submit code</button>
          </Box>
        </form>
      )}
    </Box>
  );
};
