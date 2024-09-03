import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../types/types.js";
import { filterErrorMessage } from "../../utils/filterErrorMessage.js";
import fs from "fs";

const userProfileValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    const imageSchema = Joi.object({
      fieldName: Joi.string().valid("profilepic", "coverphoto").required(),
      fileName: Joi.string()
        .regex(/\.(jpg|jpeg|png)$/i)
        .required(),
      fileSize: Joi.number()
        .max(5 * 1024 * 1024)
        .required(), // 5MB limit
      mimetype: Joi.string().valid("image/jpeg", "image/png").required(), // Validate mimetype
    });

    const { originalname, size, mimetype, fieldname } = req.file;

    const { error } = imageSchema.validate({
      fieldName: fieldname,
      fileName: originalname,
      fileSize: size,
      mimetype: mimetype,
    });

    if (error) {
      console.log(error);
      const customErrMessage = filterErrorMessage(error.details[0].message);
      fs.unlinkSync(req.file.path);

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid file",
        details: customErrMessage,
      });
    }
  }

  const bodySchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20),
    fullName: Joi.string().min(3).max(20),
    currentPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
    newPassword: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .when("currentPassword", {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
  });
  const { error, value } = bodySchema.validate(req.body);
  if (error) {
    console.log(error);
    const customErrMessage = filterErrorMessage(error.details[0].message);

    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid input values",
      details: customErrMessage,
    });
  }
  next();
};

export default userProfileValidator;
