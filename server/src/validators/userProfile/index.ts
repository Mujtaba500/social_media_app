import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../types/types.js";

const userProfileValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20),
    fullName: Joi.string().min(3).max(20),
    profilePic: Joi.string(),
    coverphoto: Joi.string(),
    currentPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
    newPassword: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .when("currentPassword", {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
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
      message: "Invalid input values",
      details: customErrMessage,
    });
  }
  next();
};

export default userProfileValidator;
