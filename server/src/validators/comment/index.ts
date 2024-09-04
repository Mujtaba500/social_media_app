import { customRequest } from "../../types/types.js";
import Joi from "joi";
import { NextFunction, Response } from "express";
import { HttpStatusCode } from "../../types/types.js";
import { filterErrorMessage } from "../../utils/filterErrorMessage.js";

const commentValidator = (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    body: Joi.string().max(100).required(),
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    console.log(error);
    const customErrMessage = filterErrorMessage(error.details[0].message);

    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid input",
      details: customErrMessage,
    });
  }
  next();
};

export default commentValidator;
