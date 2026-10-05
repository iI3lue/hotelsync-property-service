-- CreateTable
CREATE TABLE "physical_rooms" (
    "physical_room_id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "room_number" VARCHAR(20) NOT NULL,
    "available_from" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "physical_rooms_pkey" PRIMARY KEY ("physical_room_id")
);

-- CreateTable
CREATE TABLE "event_outbox" (
    "event_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "payload" JSON NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_outbox_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "physical_rooms_hotel_id_room_number_key" ON "physical_rooms"("hotel_id", "room_number");

-- CreateIndex
CREATE INDEX "physical_rooms_hotel_id_room_type_id_idx" ON "physical_rooms"("hotel_id", "room_type_id");

-- CreateIndex
CREATE INDEX "event_outbox_status_created_at_idx" ON "event_outbox"("status", "created_at");

-- AddForeignKey
ALTER TABLE "physical_rooms" ADD CONSTRAINT "physical_rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_rooms" ADD CONSTRAINT "physical_rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("room_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
