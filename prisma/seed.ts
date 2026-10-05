import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// IDs fijos: el seed de R&A usa los mismos room_type_id y alinea sus cupos
// con la cantidad de unidades fisicas de este catalogo (entornos frescos).
export const HOTEL_CENTRO_ID = "11111111-1111-4111-8111-111111111111";
export const HOTEL_COSTA_ID = "22222222-2222-4222-8222-222222222222";
export const ROOM_TYPE_STANDARD_ID = "a1a1a1a1-a1a1-4a1a-8a1a-a1a1a1a1a1a1";
export const ROOM_TYPE_DELUXE_ID = "b2b2b2b2-b2b2-4b2b-8b2b-b2b2b2b2b2b2";
export const ROOM_TYPE_BEACH_ID = "c3c3c3c3-c3c3-4c3c-8c3c-c3c3c3c3c3c3";

function roomNumbers(prefix: string, from: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}${from + i}`);
}

async function main() {
  console.log("Seeding property database...");

  const existing = await prisma.hotel.findUnique({
    where: { hotel_id: HOTEL_CENTRO_ID },
    select: { hotel_id: true },
  });
  if (existing) {
    console.log("Seed data already present, skipping.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  await prisma.hotel.createMany({
    data: [
      {
        hotel_id: HOTEL_CENTRO_ID,
        name: "Hotel Sync Centro",
        city: "Buenos Aires",
        country: "Argentina",
        timezone: "America/Argentina/Buenos_Aires",
      },
      {
        hotel_id: HOTEL_COSTA_ID,
        name: "Hotel Sync Costa",
        city: "Mar del Plata",
        country: "Argentina",
        timezone: "America/Argentina/Buenos_Aires",
      },
    ],
  });

  await prisma.roomType.createMany({
    data: [
      {
        room_type_id: ROOM_TYPE_STANDARD_ID,
        hotel_id: HOTEL_CENTRO_ID,
        name: "Standard Double",
        capacity: 2,
        base_rate: 8500.0,
        amenities: ["wifi", "tv", "air_conditioning"],
      },
      {
        room_type_id: ROOM_TYPE_DELUXE_ID,
        hotel_id: HOTEL_CENTRO_ID,
        name: "Deluxe Suite",
        capacity: 3,
        base_rate: 15000.0,
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "ocean_view"],
      },
      {
        room_type_id: ROOM_TYPE_BEACH_ID,
        hotel_id: HOTEL_COSTA_ID,
        name: "Beach Room",
        capacity: 2,
        base_rate: 12000.0,
        amenities: ["wifi", "tv", "balcony", "beach_view"],
      },
    ],
  });

  // Catalogo fisico alineado con los cupos del seed de R&A.
  const units: Array<{ hotel_id: string; room_type_id: string; room_number: string }> = [
    ...roomNumbers("10", 1, 10).map((room_number) => ({
      hotel_id: HOTEL_CENTRO_ID,
      room_type_id: ROOM_TYPE_STANDARD_ID,
      room_number,
    })),
    ...roomNumbers("20", 1, 5).map((room_number) => ({
      hotel_id: HOTEL_CENTRO_ID,
      room_type_id: ROOM_TYPE_DELUXE_ID,
      room_number,
    })),
    ...roomNumbers("30", 1, 5).map((room_number) => ({
      hotel_id: HOTEL_COSTA_ID,
      room_type_id: ROOM_TYPE_BEACH_ID,
      room_number,
    })),
  ];
  await prisma.physicalRoom.createMany({
    data: units.map((u) => ({
      ...u,
      available_from: new Date(`${today}T00:00:00.000Z`),
      is_active: true,
    })),
  });

  await prisma.cancellationPolicy.createMany({
    data: [
      {
        hotel_id: HOTEL_CENTRO_ID,
        name: "Flexible",
        description: "Free cancellation up to 24 hours before check-in.",
      },
      {
        hotel_id: HOTEL_COSTA_ID,
        name: "Moderate",
        description: "Free cancellation up to 48 hours before check-in.",
      },
    ],
  });

  console.log(
    `Seed data created: 2 hotels, 3 room types, ${units.length} physical rooms.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
