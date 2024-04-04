import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const getEventAttendees = async (app: FastifyInstance) => {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/events/:eventId/attendees", {
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
            } ,
            take: 10,
            skip: pageIndex * 10
        });

        return reply.status(200).send({ 
            attendee: attendee.map(attendee => {
                return {
                    id: attendee.id,
                    name: attendee.name,
                    email: attendee.email,
                    eventTitle: attendee.event.title,
                    createAt: attendee.createAt,
                    checkInAt: attendee.checkin?.createAt ?? null
                }
            })
        })

    });
}