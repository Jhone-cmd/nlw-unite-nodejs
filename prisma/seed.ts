import { prisma } from "../src/lib/prisma";

export async function seed() {
    await prisma.event.create({
        data: {
            id: "602879b1-6751-4db3-9982-dffdc03e17d3",
            title: "Unite Summit",
            slug: "unite-summit",
            details: "Um evento para dev(s) que são apaixados(as) por código!",
            maximumAttendees: 120
        }
    })
}

seed().then(() => {
    console.log("Seed completed.");
    prisma.$disconnect();
})