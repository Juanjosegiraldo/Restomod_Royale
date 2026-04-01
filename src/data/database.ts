import type { Vehicle } from "../types";

export const vehicles: Vehicle[] = [
  {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Mustang 69",
    config: {
      motor: "V8 6.2L Supercharged",
      pintura: "Racing Red",
      rines: "20\" Carbon Fiber",
      interior: "Carbon Fiber Racing",
      suspension: "Air Ride Adjustable",
      tecnologia: "Full Digital + HUD"
    },
    accessories: [
      { name: "Spoiler", material: "Carbon Fiber" },
      { name: "Nitro System", material: "Titanium" }
    ]
  }
];