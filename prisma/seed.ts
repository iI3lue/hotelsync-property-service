import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding property database...");

  const hotel1 = await prisma.hotel.create({
    data: {
      name: "Hotel Sync Centro",
      city: "Buenos Aires",
      country: "Argentina",
      timezone: "America/Argentina/Buenos_Aires",
    },
  });

  const hotel2 = await prisma.hotel.create({
    data: {
      name: "Hotel Sync Costa",
      city: "Mar del Plata",
      country: "Argentina",
      timezone: "America/Argentina/Buenos_Aires",
    },
  });

  await prisma.roomType.createMany({
    data: [
      {
        hotel_id: hotel1.hotel_id,
        name: "Standard Double",
        capacity: 2,
        base_rate: 8500.0,
        amenities: ["wifi", "tv", "air_conditioning"],
      },
      {
        hotel_id: hotel1.hotel_id,
        name: "Deluxe Suite",
        capacity: 3,
        base_rate: 15000.0,
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "ocean_view"],
      },
      {
        hotel_id: hotel2.hotel_id,
        name: "Beach Room",
        capacity: 2,
        base_rate: 12000.0,
        amenities: ["wifi", "tv", "balcony", "beach_view"],
      },
    ],
  });

  await prisma.cancellationPolicy.createMany({
    data: [
      {
        hotel_id: hotel1.hotel_id,
        name: "Flexible",
        description: "Free cancellation up to 24 hours before check-in.",
      },
      {
        hotel_id: hotel2.hotel_id,
        name: "Moderate",
        description: "Free cancellation up to 48 hours before check-in.",
      },
    ],
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
