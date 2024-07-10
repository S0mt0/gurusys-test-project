type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

//============= API REQUESTS PAYLOAD TYPES ============= /
type SignUp = {
  auth: "google" | "email";
  username: string;
  email: string;
  password: string;
};

type Login = {
  auth: "google" | "email";
  email: string;
  password: string;
};

type EmailPayload = {
  email: string;
};

type VerifyResetPayload = {
  password_reset_code: string;
};

type ResetPasswordPayload = {
  new_password: string;
  confirm_password: string;
};

type NewPasswordPayload = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

type Avatar = FormData;

type ProfileUpdate = Partial<UserProfile>;
