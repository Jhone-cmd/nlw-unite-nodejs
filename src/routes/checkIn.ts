import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_erros/BadRequest";

export const checkIn = async (app: FastifyInstance) => {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/check-in", {
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

        const checkIn = await prisma.checkin.findUnique({
            where: {
                attendeeId
            }
        });

        if(checkIn !== null) {
            throw new BadRequest("Attendee already checked in.")
        }

        await  prisma.checkin.create({
            data: {
                attendeeId
            }
        });

        return reply.status(201).send()
    });
}