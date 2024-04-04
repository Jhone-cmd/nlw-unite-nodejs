import {
  registerForEvent
} from "./chunk-3TR27W23.mjs";
import {
  errorHandler
} from "./chunk-6TOTX73I.mjs";
import {
  checkIn
} from "./chunk-HCZRP6LL.mjs";
import {
  createEvent
} from "./chunk-QDPIBNPN.mjs";
import "./chunk-URXW7PPC.mjs";
import {
  getAttendeeBagde
} from "./chunk-AMK6MHW2.mjs";
import {
  getEvent
} from "./chunk-CLVCMNCH.mjs";
import "./chunk-VL5OQNO5.mjs";
import {
  getEventAttendees
} from "./chunk-F6MHCI42.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante o NLW Unite - NodeJS da RocketSeat.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.register(fastifyCors, {
  origin: "*"
});
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBagde);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server Running\u{1F680}");
});
