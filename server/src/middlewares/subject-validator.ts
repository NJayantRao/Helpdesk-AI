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

export const subjectValidation = [
  body("subjectName")
    .trim()
    .optional()
    .isString()
    .withMessage("Subject Name must be a string"),
  body("subjectCode")
    .trim()
    .optional()
    .isString()
    .withMessage("Subject code must be a string"),
  body("credits")
    .trim()
    .optional()
    .isInt()
    .withMessage("Credits must be a Number"),
  body("departmentId")
    .trim()
    .optional()
    .isString()
    .withMessage("Department Id must be a string"),
  validateResult,
];
