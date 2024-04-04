import {
  BadRequest
} from "./chunk-VL5OQNO5.mjs";

// src/errorHandler.ts
import { ZodError } from "zod";
var errorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Error during validation",
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof BadRequest) {
    return reply.status(400).send({ error: error.message });
  }
  return reply.status(500).send({ message: "Internal Server Error" });
};

export {
  errorHandler
};
