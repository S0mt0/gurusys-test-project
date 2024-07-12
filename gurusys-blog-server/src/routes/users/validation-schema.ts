import Joi from "joi";

// const joiPassword = Joi.extend(joiPasswordExtendCore) as JoiPasswordExtend;

const specialCharacterRegex = /[!@#\$%\^\&*\)\(+=._-]+/; // at least one special character
const lowercaseRegex = /[a-z]+/; // at least one lowercase letter
const uppercaseRegex = /[A-Z]+/; // at least one uppercase letter
const numericRegex = /[0-9]+/; // at least one numeric character
const noWhiteSpacesRegex = /^\S+$/; // no white spaces
const onlyLatinCharactersRegex = /^[A-Za-z0-9!@#\$%\^\&*\)\(+=._-]+$/; // only Latin characters

/** Joi Validation Schema for new password reset */
export const UpdatePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string()
    .min(6)
    .max(30)
    .pattern(specialCharacterRegex, "special character")
    .pattern(lowercaseRegex, "lowercase letter")
    .pattern(uppercaseRegex, "uppercase letter")
    .pattern(numericRegex, "numeric character")
    .pattern(noWhiteSpacesRegex, "no white spaces")
    .pattern(onlyLatinCharactersRegex, "only Latin characters")
    .required(),
  confirm_password: Joi.ref("new_password"),
}).with("new_password", "confirm_password");

/** Joi Validation Schema for new password reset */
export const CreateNewPasswordSchema = Joi.object({
  new_password: Joi.string()
    .min(6)
    .max(30)
    .pattern(specialCharacterRegex, "special character")
    .pattern(lowercaseRegex, "lowercase letter")
    .pattern(uppercaseRegex, "uppercase letter")
    .pattern(numericRegex, "numeric character")
    .pattern(noWhiteSpacesRegex, "no white spaces")
    .pattern(onlyLatinCharactersRegex, "only Latin characters")
    .required(),

  confirm_password: Joi.ref("new_password"),
}).with("new_password", "confirm_password");

/** Joi Validation Schema for profile update data */
export const SignUpDataSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
}).required();

/** Joi Validation Schema for oauth provided login/signup */
export const OAuthSchema = Joi.object({
  access_token: Joi.string().required(),
}).required();

/** Joi Validation Schema for profile update data */
export const ProfileUpdateDataSchema = Joi.object({
  profile_info: Joi.object({
    username: Joi.string(),
    fullname: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    avatarUrl: Joi.string(),
    password: Joi.string(),
    bio: Joi.string().max(200).allow(""),
  }),

  social_links: Joi.object({
    youtube: Joi.string(),
    instagram: Joi.string(),
    facebook: Joi.string(),
    twitter: Joi.string(),
    github: Joi.string(),
    website: Joi.string().max(200).allow(""),
  }),
})
  .required()
  .unknown(true);

export const ProfileAvatarSchema = Joi.object({
  avatar: Joi.object({
    filename: Joi.string(),

    fieldName: Joi.string(),

    originalFilename: Joi.string(),

    path: Joi.string().required(),

    headers: Joi.object({
      "content-disposition": Joi.string(),
      "content-type": Joi.string().valid(
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/png"
      ),
    }),

    size: Joi.number().max(5000000), // Max of 5 megabytes(MB) per profile image

    name: Joi.string().required(),

    type: Joi.string()
      .valid("image/jpeg", "image/jpg", "image/gif", "image/png")
      .required(),

    bytes: Joi.number(),
  })
    .unknown(true)
    .required(),
}).required();

export const EmailSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

export const LoginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

export const PasswordResetCodeSchema = Joi.object({
  password_reset_code: Joi.string().trim().required(),
});
