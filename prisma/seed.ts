import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const menu = [
  {
    slug: "espresso",
    name: "Эспрессо",
    description: "Плотный шот с какао и карамельной корочкой.",
    price: 250,
    category: "espresso",
    image: "https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?auto=format&fit=crop&w=900&q=80",
    featured: true,
    sort: 1,
  },
  {
    slug: "americano",
    name: "Американо",
    description: "Эспрессо и горячая вода. Чистый, без лишнего.",
    price: 280,
    category: "espresso",
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 2,
  },
  {
    slug: "filter-day",
    name: "Фильтр дня",
    description: "Лот на баре меняется. Спросите бариста про вкус.",
    price: 350,
    category: "filter",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    featured: true,
    sort: 3,
  },
  {
    slug: "v60",
    name: "V60",
    description: "Ручной пуровер на 300 мл. Яркая кислотность, длинное послевкусие.",
    price: 420,
    category: "filter",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 4,
  },
  {
    slug: "flat-white",
    name: "Флэт уайт",
    description: "Двойной эспрессо и микропена. Молоко не спорит с зерном.",
    price: 380,
    category: "milk",
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=900&q=80",
    featured: true,
    sort: 5,
  },
  {
    slug: "cappuccino",
    name: "Капучино",
    description: "Классика на цельном молоке. Ореховая сладость.",
    price: 350,
    category: "milk",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 6,
  },
  {
    slug: "latte",
    name: "Латте",
    description: "Мягче флэта. Можно на овсяном.",
    price: 380,
    category: "milk",
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 7,
  },
  {
    slug: "croissant",
    name: "Круассан",
    description: "Сливочное масло, хрустящий край. Утром лучше всего.",
    price: 320,
    category: "food",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
    featured: true,
    sort: 8,
  },
  {
    slug: "banana-bread",
    name: "Банановый хлеб",
    description: "Домашний, с грецким орехом. Идеален к фильтру.",
    price: 290,
    category: "food",
    image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 9,
  },
  {
    slug: "cheesecake",
    name: "Чизкейк",
    description: "Нежный сливочный, с ягодным кули.",
    price: 450,
    category: "food",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
    featured: true,
    sort: 10,
  },
  {
    slug: "brownie",
    name: "Брауни",
    description: "Шоколадный, влажный центр, морская соль.",
    price: 340,
    category: "food",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 11,
  },
  {
    slug: "cinnamon-bun",
    name: "Синнабон",
    description: "Корица и крем-чиз. Лучше тёплым.",
    price: 360,
    category: "food",
    image: "https://images.unsplash.com/photo-1509365465985-25d7493c2d61?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 12,
  },
  {
    slug: "lemon-tart",
    name: "Лимонный тарт",
    description: "Кислый курд, песочная основа, меренга.",
    price: 420,
    category: "food",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 13,
  },
  {
    slug: "cookie",
    name: "Печенье",
    description: "С шоколадными кусочками, к американо.",
    price: 200,
    category: "food",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
    featured: false,
    sort: 14,
  },
  {
    slug: "tiramisu",
    name: "Тирамису",
    description: "Классика: кофе, маскарпоне, какао.",
    price: 480,
    category: "food",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80",
    featured: true,
    sort: 15,
  },
]

async function main() {
  const passwordHash = await bcrypt.hash("varka2026", 10)

  await prisma.admin.upsert({
    where: { email: "admin@varka.cafe" },
    update: { passwordHash, name: "Админ ВАРКА" },
    create: {
      email: "admin@varka.cafe",
      name: "Админ ВАРКА",
      passwordHash,
    },
  })

  for (const item of menu) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    })
  }

  const guest = await prisma.guest.upsert({
    where: { phone: "37061245817" },
    update: { name: "Анна Демо" },
    create: {
      name: "Анна Демо",
      phone: "37061245817",
      email: "anna@example.com",
    },
  })

  const espresso = await prisma.menuItem.findUnique({ where: { slug: "espresso" } })
  const flat = await prisma.menuItem.findUnique({ where: { slug: "flat-white" } })

  const existingOrders = await prisma.order.count()
  if (existingOrders === 0 && espresso && flat) {
    await prisma.order.create({
      data: {
        guestId: guest.id,
        status: "new",
        comment: "Без сахара",
        total: espresso.price + flat.price,
        items: {
          create: [
            { menuItemId: espresso.id, name: espresso.name, price: espresso.price, qty: 1 },
            { menuItemId: flat.id, name: flat.name, price: flat.price, qty: 1 },
          ],
        },
      },
    })
  }

  const existingBookings = await prisma.booking.count()
  if (existingBookings === 0) {
    const startsAt = new Date()
    startsAt.setDate(startsAt.getDate() + 1)
    startsAt.setHours(18, 0, 0, 0)
    await prisma.booking.create({
      data: {
        guestId: guest.id,
        partySize: 2,
        startsAt,
        comment: "Столик у окна",
        status: "new",
      },
    })
  }

  console.log("Seed OK: admin@varka.cafe / varka2026")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
