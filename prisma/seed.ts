import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const SEED_HOTELS = [
  {
    hotel_id: "11111111-1111-4111-8111-111111111111",
    name: "Hotel Sync Centro",
    address: "Av. Corrientes 1234, Microcentro",
    city: "Buenos Aires",
    country: "Argentina",
    timezone: "America/Argentina/Buenos_Aires",
    roomTypes: [
      {
        room_type_id: "a1a1a1a1-a1a1-4a1a-8a1a-a1a1a1a1a1a1",
        name: "Standard Double",
        capacity: 2,
        base_rate: 8500.0,
        amenities: ["wifi", "tv", "air_conditioning"],
        image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        units: 10,
        prefix: "10",
      },
      {
        room_type_id: "b2b2b2b2-b2b2-4b2b-8b2b-b2b2b2b2b2b2",
        name: "Deluxe Suite",
        capacity: 3,
        base_rate: 15000.0,
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "ocean_view"],
        image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        units: 8,
        prefix: "20",
      },
      {
        room_type_id: "d4d4d4d4-d4d4-4d4d-8d4d-d4d4d4d4d4d4",
        name: "Executive King",
        capacity: 2,
        base_rate: 18500.0,
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "spa"],
        image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        units: 6,
        prefix: "30",
      },
    ],
    cancellationPolicies: [
      {
        name: "Cancelación Flexible",
        description: "Cancelación gratuita hasta 24 horas antes del check-in. Reembolso total garantizado.",
      },
    ],
  },
  {
    hotel_id: "22222222-2222-4222-8222-222222222222",
    name: "Hotel Sync Costa",
    address: "Boulevard Marítimo Patricio Peralta Ramos 2450",
    city: "Mar del Plata",
    country: "Argentina",
    timezone: "America/Argentina/Buenos_Aires",
    roomTypes: [
      {
        room_type_id: "c3c3c3c3-c3c3-4c3c-8c3c-c3c3c3c3c3c3",
        name: "Beach Room",
        capacity: 2,
        base_rate: 12000.0,
        amenities: ["wifi", "tv", "balcony", "beach_view"],
        image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        units: 8,
        prefix: "10",
      },
      {
        room_type_id: "e5e5e5e5-e5e5-4e5e-8e5e-e5e5e5e5e5e5",
        name: "Oceanfront Family Suite",
        capacity: 4,
        base_rate: 22000.0,
        amenities: ["wifi", "tv", "balcony", "beach_view", "minibar"],
        image_url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
        units: 5,
        prefix: "20",
      },
    ],
    cancellationPolicies: [
      {
        name: "Cancelación Moderada",
        description: "Cancelación gratuita hasta 48 horas previas al arribo. Posterior se cobra la primera noche.",
      },
    ],
  },
  {
    hotel_id: "33333333-3333-4333-8333-333333333333",
    name: "Hotel Sync Bariloche & Spa",
    address: "Av. Exequiel Bustillo Km 4.5, Playa Bonita",
    city: "San Carlos de Bariloche",
    country: "Argentina",
    timezone: "America/Argentina/Buenos_Aires",
    roomTypes: [
      {
        room_type_id: "f6f6f6f6-f6f6-4f6f-8f6f-f6f6f6f6f6f6",
        name: "Alpine Comfort",
        capacity: 2,
        base_rate: 16500.0,
        amenities: ["wifi", "spa", "tv", "air_conditioning"],
        image_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
        units: 6,
        prefix: "10",
      },
      {
        room_type_id: "a7a7a7a7-a7a7-4a7a-8a7a-a7a7a7a7a7a7",
        name: "Lake View Chalet",
        capacity: 4,
        base_rate: 28000.0,
        amenities: ["wifi", "spa", "balcony", "minibar", "room_service"],
        image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        units: 4,
        prefix: "20",
      },
    ],
    cancellationPolicies: [
      {
        name: "Cancelación Flexible Montaña",
        description: "Cancelación sin cargo hasta 72 horas antes del ingreso. Modificación de fechas disponible.",
      },
    ],
  },
  {
    hotel_id: "44444444-4444-4444-8444-444444444444",
    name: "Hotel Sync Mendoza Wine & Golf",
    address: "Ruta Provincial 82 Km 21, Luján de Cuyo",
    city: "Mendoza",
    country: "Argentina",
    timezone: "America/Argentina/Mendoza",
    roomTypes: [
      {
        room_type_id: "b8b8b8b8-b8b8-4b8b-8b8b-b8b8b8b8b8b8",
        name: "Vineyard Deluxe",
        capacity: 2,
        base_rate: 17500.0,
        amenities: ["wifi", "pool", "minibar", "spa"],
        image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        units: 6,
        prefix: "10",
      },
      {
        room_type_id: "c9c9c9c9-c9c9-4c9c-8c9c-c9c9c9c9c9c9",
        name: "Grand Cava Suite",
        capacity: 3,
        base_rate: 26000.0,
        amenities: ["wifi", "pool", "minibar", "balcony", "room_service"],
        image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        units: 4,
        prefix: "20",
      },
    ],
    cancellationPolicies: [
      {
        name: "Política Enológica Flexible",
        description: "Cancelación sin costo hasta 3 días antes de la llegada.",
      },
    ],
  },
  {
    hotel_id: "55555555-5555-4555-8555-555555555555",
    name: "Hotel Sync Poblado Medellín",
    address: "Carrera 43A # 1-50, El Poblado",
    city: "Medellín",
    country: "Colombia",
    timezone: "America/Bogota",
    roomTypes: [
      {
        room_type_id: "da1da1da-1da1-4da1-8da1-da1da1da1da1",
        name: "Urban Superior",
        capacity: 2,
        base_rate: 14000.0,
        amenities: ["wifi", "pool", "gym", "air_conditioning"],
        image_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
        units: 10,
        prefix: "10",
      },
      {
        room_type_id: "eb2eb2eb-2eb2-4eb2-8eb2-eb2eb2eb2eb2",
        name: "Panoramic Skyline Suite",
        capacity: 3,
        base_rate: 24500.0,
        amenities: ["wifi", "pool", "gym", "minibar", "balcony"],
        image_url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
        units: 6,
        prefix: "20",
      },
    ],
    cancellationPolicies: [
      {
        name: "Cancelación Flexible Urbano",
        description: "Cancelación gratuita hasta 24 horas antes del check-in.",
      },
    ],
  },
  {
    hotel_id: "66666666-6666-4666-8666-666666666666",
    name: "Hotel Sync Cartagena Caribe",
    address: "Calle del Cuartel # 36-12, Centro Histórico",
    city: "Cartagena",
    country: "Colombia",
    timezone: "America/Bogota",
    roomTypes: [
      {
        room_type_id: "fc3fc3fc-3fc3-4fc3-8fc3-fc3fc3fc3fc3",
        name: "Colonial Double",
        capacity: 2,
        base_rate: 19000.0,
        amenities: ["wifi", "pool", "air_conditioning", "breakfast"],
        image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        units: 8,
        prefix: "10",
      },
      {
        room_type_id: "ad4ad4ad-4ad4-4ad4-8ad4-ad4ad4ad4ad4",
        name: "Penthouse Caribe",
        capacity: 4,
        base_rate: 35000.0,
        amenities: ["wifi", "pool", "balcony", "minibar", "ocean_view", "spa"],
        image_url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
        units: 4,
        prefix: "20",
      },
    ],
    cancellationPolicies: [
      {
        name: "Cancelación Caribe Relax",
        description: "Cancelación sin penalidad hasta 48 horas previas al arribo.",
      },
    ],
  },
];

/** Aliases de compatibilidad con el seed original (IDs fijos históricos). */
export const HOTEL_CENTRO_ID = "11111111-1111-4111-8111-111111111111";
export const HOTEL_COSTA_ID = "22222222-2222-4222-8222-222222222222";

function roomNumbers(prefix: string, from: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}${String(from + i).padStart(2, "0")}`);
}

async function main() {
  console.log("Seeding property database (non-destructive upsert)...");

  // Nunca borramos: los hoteles creados por API u otros entornos se conservan.
  // Solo creamos/actualizamos los 6 hoteles fijos y sus dependientes.
  const today = new Date().toISOString().slice(0, 10);
  let upsertedRooms = 0;

  for (const h of SEED_HOTELS) {
    await prisma.hotel.upsert({
      where: { hotel_id: h.hotel_id },
      update: {
        name: h.name,
        address: h.address,
        city: h.city,
        country: h.country,
        timezone: h.timezone,
      },
      create: {
        hotel_id: h.hotel_id,
        name: h.name,
        address: h.address,
        city: h.city,
        country: h.country,
        timezone: h.timezone,
      },
    });

    for (const p of h.cancellationPolicies) {
      const existing = await prisma.cancellationPolicy.findFirst({
        where: { hotel_id: h.hotel_id, name: p.name },
        select: { policy_id: true },
      });
      if (!existing) {
        await prisma.cancellationPolicy.create({
          data: { hotel_id: h.hotel_id, name: p.name, description: p.description },
        });
      }
    }

    for (const rt of h.roomTypes) {
      await prisma.roomType.upsert({
        where: { room_type_id: rt.room_type_id },
        update: {
          hotel_id: h.hotel_id,
          name: rt.name,
          capacity: rt.capacity,
          base_rate: rt.base_rate,
          amenities: rt.amenities,
          image_url: rt.image_url,
        },
        create: {
          room_type_id: rt.room_type_id,
          hotel_id: h.hotel_id,
          name: rt.name,
          capacity: rt.capacity,
          base_rate: rt.base_rate,
          amenities: rt.amenities,
          image_url: rt.image_url,
        },
      });

      const nums = roomNumbers(rt.prefix, 1, rt.units);
      const created = await prisma.physicalRoom.createMany({
        data: nums.map((room_number) => ({
          hotel_id: h.hotel_id,
          room_type_id: rt.room_type_id,
          room_number,
          available_from: new Date(`${today}T00:00:00.000Z`),
          is_active: true,
        })),
        skipDuplicates: true,
      });
      upsertedRooms += created.count;
    }
  }

  console.log(
    `Property seed completed (upsert): ${SEED_HOTELS.length} fixed hotels ensured, ${upsertedRooms} new physical rooms created (existing data preserved).`
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
