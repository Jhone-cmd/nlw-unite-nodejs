import  { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_erros/BadRequest";

export const registerForEvent = async (app: FastifyInstance) => {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post("/events/:eventId/attendees", {
        schema: {
            summary: "Register an attendee",
            tags: ["Attendees"],
            body: z.object({
                name: z.string().min(4),
                email: z.string().email()
            }),
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                201: z.object({
                    attendeeId: z.number().int()
                })
            }
        }
    }, async (request, reply) => {

        const { name, email } = request.body;
        const { eventId } = request.params;
        
        const attendeeFromEmail  = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    eventId,
                    email
                }
            }
        });

        if(attendeeFromEmail !== null) {
            throw new BadRequest("This email is already registered for this event.")
        }

        const [event, amountOfAttendeesForEvent] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId
                }
            }),
            
            prisma.attendee.count({
                where: {
                    eventId
                }
            })
        ]);

        if(event?.maximumAttendees && amountOfAttendeesForEvent >=  event.maximumAttendees) {
            throw new BadRequest("The maximum number of attendees for this event has been reached.");
        }

        const attendee = await prisma.attendee.create({
            data : {
                name,
                email,
                eventId
            }
        });

        return reply.status(201).send({ attendeeId: attendee.id });
    });
}