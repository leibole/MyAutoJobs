import { Box, Button, CircularProgress } from "@mui/material";
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
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/Input";

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

interface PhoneForm {
  phone: string;
}

interface OtpForm {
  otp: string;
}

export const Login = ({ setUser }: { setUser: (user: any) => void }) => {
  const [step, setStep] = useState(STEPS.PHONE);
  const [verifying, setVerifying] = useState(false);

  const confirmationResult = useRef<any>(null);

  const {
    control: phoneControl,
    handleSubmit: phoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<PhoneForm>({
    defaultValues: {
      phone: "",
    },
  });

  const {
    control: otpControl,
    handleSubmit: otpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpForm>({
    defaultValues: {
      otp: "",
    },
  });

  const onPhoneSubmit = async ({ phone }: PhoneForm) => {
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

  const onOtpSubmit = async ({ otp }: OtpForm) => {
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
        <form onSubmit={phoneSubmit(onPhoneSubmit)} key="phone-form">
          <Input
            control={phoneControl}
            name="phone"
            rules={{ required: { value: true, message: "Phone is required" } }}
          />
          <Box marginTop={2}>
            {verifying ? (
              <CircularProgress />
            ) : (
              <button type="submit" id="sign-in-button">
                Login
              </button>
            )}
          </Box>
          {phoneErrors.phone?.message && (
            <Box color="red" fontSize="12px">
              {phoneErrors.phone?.message}
            </Box>
          )}
        </form>
      ) : (
        <form onSubmit={otpSubmit(onOtpSubmit)} key="otp-form">
          <Input
            control={otpControl}
            name="otp"
            rules={{ required: { value: true, message: "Code is required" } }}
          />
          <Box marginTop={2}>
            <button type="submit">Submit code</button>
          </Box>
        </form>
      )}
    </Box>
  );
};
