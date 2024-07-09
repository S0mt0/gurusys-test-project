import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signUpSchema } from "../form-validations";
import { isAxiosError } from "axios";
import { useState } from "react";
import { signup } from "../api";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function useSignUpForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      account_type: "admin",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      phone: [""],
    },
  });

  const { handleSubmit, setValue, watch } = form;

  const phoneValue = watch("phone")[0]; // Watch the first element of the phone array

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("phone", [value], { shouldValidate: true });
  };

  async function onSubmit(values: SignUp) {
    setErrorMessage("");
    setSuccessMessage("");
    setIsPending(true);

    try {
      const res = await signup(values);
      setSuccessMessage(res.data.message!);
      ls("token", res.headers["authorization"]);
    } catch (error: any) {
      if (isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message);
      } else {
        setErrorMessage(error?.message || "Something went wrong, try again.");
      }
    } finally {
      setIsPending(false);
    }
  }

  return {
    form,
    handleSubmit: handleSubmit(onSubmit),
    handlePhoneChange,
    phoneValue,
    isPending,
    errorMessage,
    successMessage,
  };
}
