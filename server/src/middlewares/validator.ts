import { body, validationResult } from "express-validator";

const validateResult = async function (req: any, res: any, next: any) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);

    return res
      .status(400)
      .json({ errors: errors.array().map((err: any) => err.msg) });
  }
  next();
};

export const studentRegistrationValidation = [
  body("fullName")
    .trim()
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .trim()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("avatarUrl")
    .trim()
    .isString()
    .withMessage("Avatar Url must be a string"),
  body("gender")
    .trim()
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["MALE", "FEMALE", "OTHERS"])
    .withMessage("Gender must be either Male, Female or Other"),
  body("branch").trim().isString().withMessage("Branch must be a string"),
  body("isHostelite")
    .trim()
    .isBoolean()
    .withMessage("Is Hostelite must be a boolean"),
  body("departmentId")
    .trim()
    .isString()
    .withMessage("Department Id must be a string"),
  validateResult,
];
export const adminRegistrationValidation = [
  body("fullName")
    .trim()
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .trim()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("avatarUrl")
    .trim()
    .isString()
    .withMessage("Avatar Url must be a string"),
  body("gender")
    .trim()
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["MALE", "FEMALE", "OTHERS"])
    .withMessage("Gender must be either Male, Female or Other"),
  body("branch").trim().isString().withMessage("Branch must be a string"),
  body("designation")
    .trim()
    .isString()
    .withMessage("Designation must be a boolean"),
  body("departmentId")
    .trim()
    .isString()
    .withMessage("Department Id must be a string"),
  validateResult,
];

export const userLoginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .isString()
    .trim()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validateResult,
];

export const resetPasswordValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("newPassword")
    .trim()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validateResult,
];

export const usernameUpdateValidation = [
  body("username")
    .trim()
    .isString()
    .withMessage("User name must be a string")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long"),
  validateResult,
];
