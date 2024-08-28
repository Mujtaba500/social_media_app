import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../types/types.js";

const authValidator = {
  createUser: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(20).required(),
      fullName: Joi.string().min(3).max(20).required(),
      password: Joi.string()
        .pattern(new RegExp("^(?=.*[A-Z])[a-zA-Z0-9]{6,30}$"))
        .required(),
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
        message: "Invalid Credentials",
        details: customErrMessage,
      });
    }
    next();
  },
  login: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      username: Joi.string().min(3).max(20).required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
        .required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log(error.message);
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid Credentials",
      });
    }
    next();
  },
};

export default authValidator;
