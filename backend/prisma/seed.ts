import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { CarType } from "../src/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const carsData = [
  { name: "Toyota Corolla", type: CarType.economy, price: 20000, description: "A reliable and fuel-efficient sedan.", availability: true, image: "image1.jpg" },
  { name: "Honda Civic", type: CarType.economy, price: 22000, description: "A stylish compact car with great mileage.", availability: true, image: "image2.jpeg" },
  { name: "Hyundai Elantra", type: CarType.economy, price: 21000, description: "Affordable and packed with features.", availability: true, image: "image3.jpeg" },
  { name: "BMW 3 Series", type: CarType.premium, price: 45000, description: "A luxury sports sedan with advanced technology.", availability: true, image: "image4.jpeg" },
  { name: "Audi A4", type: CarType.premium, price: 46000, description: "A sophisticated and powerful sedan.", availability: true, image: "image5.jpeg" },
  { name: "Mercedes-Benz C-Class", type: CarType.premium, price: 48000, description: "Elegant design and superior comfort.", availability: true, image: "image6.jpeg" },
  { name: "Tesla Model 3", type: CarType.premium, price: 50000, description: "An electric car with autopilot capabilities.", availability: true, image: "image7.jpeg" },
  { name: "Ford Mustang", type: CarType.premium, price: 55000, description: "A classic American muscle car.", availability: true, image: "image8.jpeg" },
  { name: "Lamborghini Huracan", type: CarType.luxury, price: 250000, description: "An exotic supercar with breathtaking performance.", availability: true, image: "image9.jpeg" },
  { name: "Ferrari 488", type: CarType.luxury, price: 280000, description: "A high-performance Italian supercar.", availability: true, image: "image10.jpeg" },
  { name: "Rolls-Royce Phantom", type: CarType.luxury, price: 450000, description: "The pinnacle of luxury and craftsmanship.", availability: true, image: "image11.jpeg" },
  { name: "Porsche 911", type: CarType.luxury, price: 130000, description: "A legendary sports car with superior handling.", availability: true, image: "image12.jpeg" },
  { name: "Range Rover Autobiography", type: CarType.luxury, price: 160000, description: "A luxurious and powerful SUV.", availability: true, image: "image13.jpeg" },
  { name: "Bentley Continental GT", type: CarType.luxury, price: 210000, description: "A grand tourer with elegance and power.", availability: true, image: "image14.jpeg" },
  { name: "Chevrolet Spark", type: CarType.economy, price: 16000, description: "A compact and affordable city car.", availability: true, image: "image15.jpeg" },
  { name: "Nissan Altima", type: CarType.economy, price: 24000, description: "A comfortable midsize sedan with smooth ride.", availability: true, image: "image16.jpeg" },
  { name: "Kia Seltos", type: CarType.economy, price: 18000, description: "A feature-rich compact SUV for daily commutes.", availability: true, image: "image17.jpeg" },
  { name: "Volkswagen Jetta", type: CarType.premium, price: 42000, description: "German engineering with refined interiors.", availability: true, image: "image18.jpeg" },
  { name: "Maserati Quattroporte", type: CarType.luxury, price: 180000, description: "Italian luxury sedan with a roaring V8 engine.", availability: true, image: "image19.jpeg" },
  { name: "Aston Martin DB11", type: CarType.luxury, price: 220000, description: "A British grand tourer with timeless elegance.", availability: true, image: "image20.jpeg" },
];

const packagesData = [
  { name: "Golden Triangle Tour", price: 25000, destinations: ["Delhi", "Agra", "Jaipur"], couponCode: "GOLDEN20", availability: true, image: "p1.jpeg" },
  { name: "Goa Beach Getaway", price: 30000, destinations: ["Goa"], couponCode: "GOABLAST", availability: true, image: "p2.jpeg" },
  { name: "Kerala Backwaters Retreat", price: 35000, destinations: ["Kochi", "Alleppey", "Munnar"], couponCode: "KERALA10", availability: true, image: "p3.jpeg" },
  { name: "Himalayan Adventure", price: 40000, destinations: ["Manali", "Leh", "Ladakh"], couponCode: "HIMALAYA15", availability: true, image: "p4.jpeg" },
  { name: "Rajasthan Royal Heritage", price: 45000, destinations: ["Jaipur", "Jodhpur", "Udaipur"], couponCode: "ROYAL50", availability: true, image: "p5.jpeg" },
  { name: "North East Delight", price: 50000, destinations: ["Guwahati", "Shillong", "Kaziranga"], couponCode: "NE20", availability: true, image: "p6.jpeg" },
  { name: "Tamil Nadu Temple Tour", price: 22000, destinations: ["Chennai", "Madurai", "Rameswaram"], couponCode: "TAMIL10", availability: true, image: "p7.jpeg" },
  { name: "Andaman Island Escape", price: 60000, destinations: ["Port Blair", "Havelock Island", "Neil Island"], couponCode: "ANDAMAN25", availability: true, image: "p8.jpeg" },
  { name: "Sikkim & Darjeeling Scenic Tour", price: 38000, destinations: ["Gangtok", "Pelling", "Darjeeling"], couponCode: "SIKKIM5", availability: true, image: "p9.jpeg" },
  { name: "Spiritual Varanasi Tour", price: 18000, destinations: ["Varanasi", "Sarnath"], couponCode: "SPIRITUAL10", availability: true, image: "p10.jpeg" },
  { name: "Maharashtra Forts & Caves", price: 27000, destinations: ["Mumbai", "Ajanta", "Ellora"], couponCode: "MH20", availability: true, image: "p11.jpeg" },
  { name: "Uttarakhand Nature Trail", price: 32000, destinations: ["Rishikesh", "Mussoorie", "Nainital"], couponCode: "UTTARAKHAND30", availability: true, image: "p12.jpeg" },
  { name: "Punjab Cultural Journey", price: 26000, destinations: ["Amritsar", "Ludhiana", "Patiala"], couponCode: "PUNJAB15", availability: true, image: "p13.jpeg" },
  { name: "Meghalaya Rainforest Experience", price: 42000, destinations: ["Shillong", "Cherrapunji", "Mawsynram"], couponCode: "MEGHALAYA10", availability: true, image: "p14.jpeg" },
  { name: "Madhya Pradesh Wildlife Safari", price: 55000, destinations: ["Kanha", "Bandhavgarh", "Pench"], couponCode: "WILDLIFE25", availability: true, image: "p15.jpeg" },
  { name: "Kashmir Paradise Tour", price: 48000, destinations: ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg"], couponCode: "KASHMIR20", availability: true, image: "p16.jpeg" },
  { name: "Odisha Heritage Circuit", price: 28000, destinations: ["Bhubaneswar", "Puri", "Konark"], couponCode: "ODISHA15", availability: true, image: "p17.jpeg" },
  { name: "Gujarat Rann of Kutch Festival", price: 33000, destinations: ["Ahmedabad", "Kutch", "Dwarka", "Somnath"], couponCode: "GUJARAT10", availability: true, image: "p18.jpeg" },
  { name: "Ladakh Bike Expedition", price: 65000, destinations: ["Leh", "Nubra Valley", "Pangong Lake", "Khardung La"], couponCode: "LADAKH30", availability: true, image: "p19.jpeg" },
  { name: "Coorg Coffee Plantation Stay", price: 20000, destinations: ["Coorg", "Madikeri", "Abbey Falls"], couponCode: "COORG10", availability: true, image: "p20.jpeg" },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.package.deleteMany();
  await prisma.user.deleteMany();

  // Seed cars
  for (const car of carsData) {
    await prisma.car.create({ data: car });
  }
  console.log(`Seeded ${carsData.length} cars`);

  // Seed packages
  for (const pkg of packagesData) {
    await prisma.package.create({ data: pkg });
  }
  console.log(`Seeded ${packagesData.length} packages`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
