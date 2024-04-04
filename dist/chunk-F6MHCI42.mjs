import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/getEventAttendees.ts
import { z } from "zod";
var getEventAttendees = async (app) => {
  app.withTypeProvider().get("/events/:eventId/attendees", {
    schema: {
      summary: "Get event attendee",
      tags: ["Events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        pageIndex: z.string().nullable().default("0").transform(Number),
        search: z.string().nullish()
      }),
      response: {
        200: z.object({
          attendee: z.array(
            z.object({
              id: z.number().int(),
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              createAt: z.date().nullish(),
              checkInAt: z.date().nullable()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { pageIndex, search } = request.query;
    const attendee = await prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createAt: true,
        event: {
          select: {
            title: true
          }
        },
        checkin: {
          select: {
            createAt: true
          }
        }
      },
      where: search ? {
        eventId,
        name: {
          contains: search
        }
      } : {
        eventId
      },
      take: 10,
      skip: pageIndex * 10
    });
    return reply.status(200).send({
      attendee: attendee.map((attendee2) => {
        return {
          id: attendee2.id,
          name: attendee2.name,
          email: attendee2.email,
          eventTitle: attendee2.event.title,
          createAt: attendee2.createAt,
          checkInAt: attendee2.checkin?.createAt ?? null
        };
      })
    });
  });
};

export {
  getEventAttendees
};
