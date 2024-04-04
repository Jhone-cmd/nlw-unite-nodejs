import {
  BadRequest
} from "./chunk-VL5OQNO5.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/getEvent.ts
import { z } from "zod";
var getEvent = async (app) => {
  app.withTypeProvider().get("/events/:eventId", {
    schema: {
      summary: "Get an event",
      tags: ["Events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        200: z.object({
          title: z.string(),
          slug: z.string(),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
          maximumAttendeesAmount: z.number().int().positive()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const event = await prisma.event.findUnique({
      select: {
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: {
          select: {
            attendees: true
          }
        }
      },
      where: {
        id: eventId
      }
    });
    if (event === null) {
      throw new BadRequest("Event not found.");
    }
    return reply.status(200).send({
      title: event.title,
      slug: event.slug,
      details: event.details,
      maximumAttendees: event.maximumAttendees,
      maximumAttendeesAmount: event._count.attendees
    });
  });
};

export {
  getEvent
};
