import {
  BadRequest
} from "./chunk-VL5OQNO5.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/checkIn.ts
import { z } from "zod";
var checkIn = async (app) => {
  app.withTypeProvider().get("/attendees/:attendeeId/check-in", {
    schema: {
      summary: "Check-in an attendee",
      tags: ["Check-Ins"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const checkIn2 = await prisma.checkin.findUnique({
      where: {
        attendeeId
      }
    });
    if (checkIn2 !== null) {
      throw new BadRequest("Attendee already checked in.");
    }
    await prisma.checkin.create({
      data: {
        attendeeId
      }
    });
    return reply.status(201).send();
  });
};

export {
  checkIn
};
