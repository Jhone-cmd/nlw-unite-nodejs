import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { generateSlug } from "../utils/generateSlug";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_erros/BadRequest";

export const createEvent = async (app: FastifyInstance) => {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post("/events", {
        schema: {
            summary: "Create an event",
            tags: ["Events"],
            body: z.object({
                title: z.string().min(4),
                details: z.string().nullable(),
                maximumAttendees: z.number().int().positive().nullable()
            }),

            response: {
                201: z.object({
                        eventId: z.string().uuid()
                    })
                }
            }
        }, async (request, reply) => {  
                    
            const {
                title,
                details,
                maximumAttendees
            } = request.body;

            const slug = generateSlug(title);

            const eventwithSameSlug = await prisma.event.findUnique({
                where: {
                    slug
                }
            })

            if(eventwithSameSlug !== null) {
                throw new BadRequest("Another event with same title already exists.");
            }

            const event = await prisma.event.create({
                data: {
                    title,
                    details,
                    maximumAttendees,
                    slug
                }
            });

            return reply.status(201).send({ eventId: event.id });
        });
}