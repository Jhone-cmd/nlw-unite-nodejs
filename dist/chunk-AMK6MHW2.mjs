import {
  BadRequest
} from "./chunk-VL5OQNO5.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/getAttendeeBagde.ts
import { z } from "zod";
var getAttendeeBagde = async (app) => {
  app.withTypeProvider().get("/attendees/:attendeeId/bagde", {
    schema: {
      summary: "Get an attendee bagde",
      tags: ["Attendees"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        200: z.object({
          badge: z.object({
            name: z.string(),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInUrl: z.string().url()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendee = await prisma.attendee.findUnique({
      select: {
        name: true,
        email: true,
        event: {
          select: {
            title: true
          }
        }
      },
      where: {
        id: attendeeId
      }
    });
    if (attendee === null) {
      throw new BadRequest("Attendee not found.");
    }
    const baseURL = `${request.protocol}://${request.hostname}`;
    const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, baseURL).toString();
    return reply.status(200).send({
      badge: {
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInUrl: checkInUrl.toString()
      }
    });
  });
};

export {
  getAttendeeBagde
};
