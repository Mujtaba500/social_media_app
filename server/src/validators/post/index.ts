import { customRequest } from "../../types/types.js";
import Joi from "joi";
import { NextFunction, Response } from "express";
import { HttpStatusCode } from "../../types/types.js";
import { filterErrorMessage } from "../../utils/filterErrorMessage.js";

const postValidator = {
  createPost: (req: customRequest, res: Response, next: NextFunction) => {
    // Joi schema to validate the image's properties
    if (req.file) {
      const imageSchema = Joi.object({
        fieldName: Joi.string().valid("postImg").required(),
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

        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Invalid file",
          details: customErrMessage,
        });
      }
    }

    const bodySchema = Joi.object({
      content: Joi.string().max(100).required(),
    });
    const { error, value } = bodySchema.validate(req.body);

    if (error) {
      console.log(error);
      const customErrMessage = filterErrorMessage(error.details[0].message);

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid input",
        details: customErrMessage,
      });
    }
    next();
  },
  editPost: (req: customRequest, res: Response, next: NextFunction) => {
    if (req.file) {
      const imageSchema = Joi.object({
        fieldName: Joi.string().valid("postImg").required(),
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

        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Invalid file",
          details: customErrMessage,
        });
      }
    }

    const bodySchema = Joi.object({
      content: Joi.string().max(100),
    });
    const { error } = bodySchema.validate(req.body);
    if (error) {
      console.log(error);
      const customErrMessage = filterErrorMessage(error.details[0].message);

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid input",
        details: customErrMessage,
      });
    }
    next();
  },
};

export default postValidator;
