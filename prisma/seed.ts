import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const courses = [
  {
    title: 'Пресс и кор',
    slug: 'press',
    description: 'Глубокая проработка мышц кора — от новичка до уверенного уровня. 30 дней, 15–20 минут в день.',
    price: 2900,
    isPublished: true,
    lessons: [
      { order: 1, title: 'Введение: анатомия кора', isFree: true },
      { order: 2, title: 'Дыхание и активация', isFree: true },
      { order: 3, title: 'Планка и вариации', isFree: false },
      { order: 4, title: 'Скручивания без боли', isFree: false },
      { order: 5, title: 'Нижний пресс: подъёмы ног', isFree: false },
      { order: 6, title: 'Боковая планка и косые', isFree: false },
    ],
  },
  {
    title: 'Упругие ягодицы',
    slug: 'gluets',
    description: 'Комплексная программа для формирования ягодиц. Без инвентаря, только собственный вес.',
    price: 3400,
    isPublished: true,
    lessons: [
      { order: 1, title: 'Анатомия ягодичных мышц', isFree: true },
      { order: 2, title: 'Базовые приседания', isFree: true },
      { order: 3, title: 'Выпады: все вариации', isFree: false },
      { order: 4, title: 'Ягодичный мост', isFree: false },
      { order: 5, title: 'Суперсеты для ягодиц', isFree: false },
    ],
  },
  {
    title: 'Здоровая спина',
    slug: 'back',
    description: 'Избавься от болей в пояснице и сформируй красивую осанку за 4 недели.',
    price: 2500,
    isPublished: true,
    lessons: [
      { order: 1, title: 'Причины боли в спине', isFree: true },
      { order: 2, title: 'Растяжка поясницы', isFree: false },
      { order: 3, title: 'Укрепление разгибателей', isFree: false },
      { order: 4, title: 'Осанка и плечи', isFree: false },
    ],
  },
  {
    title: 'Гибкость и растяжка',
    slug: 'stretch',
    description: 'Мягкие и эффективные практики для развития гибкости. Подходит для любого уровня.',
    price: 1900,
    isPublished: true,
    lessons: [
      { order: 1, title: 'Основы безопасной растяжки', isFree: true },
      { order: 2, title: 'Растяжка ног и бёдер', isFree: false },
      { order: 3, title: 'Шпагат: программа подготовки', isFree: false },
    ],
  },
]

async function main() {
  console.log('Seeding courses...')
  for (const c of courses) {
    const { lessons, ...courseData } = c
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: {
        ...courseData,
        lessons: {
          create: lessons.map(l => ({ ...l, content: '' })),
        },
      },
    })
    console.log(`✓ ${course.title}`)
  }
  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
