import { customRequest } from "../../types/types.js";
import Joi from "joi";
import { NextFunction, Response } from "express";
import { HttpStatusCode } from "../../types/types.js";

const postValidator = (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    content: Joi.string().max(100),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    console.log(error);
    let customErrMessage = error.details[0].message;
    customErrMessage = customErrMessage
      .split("")
      .filter((char) => {
        let result = char.match(/^[a-z0-9A-Z ]+$/);
        return result;
      })
      .join("");

    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid input",
      details: customErrMessage,
    });
  }
  next();
};

export default postValidator;
