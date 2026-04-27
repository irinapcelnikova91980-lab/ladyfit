import { defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Курс',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название курса',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL курса',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'price',
      title: 'Цена (₽)',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Обложка курса',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'duration',
      title: 'Длительность',
      type: 'string',
    }),
    defineField({
      name: 'level',
      title: 'Уровень',
      type: 'string',
      options: {
        list: [
          { title: 'Начальный', value: 'beginner' },
          { title: 'Средний', value: 'intermediate' },
          { title: 'Любой', value: 'any' },
        ],
      },
    }),
    defineField({
      name: 'isPublished',
      title: 'Опубликован',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'lessons',
      title: 'Уроки',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Название урока', type: 'string' }),
            defineField({ name: 'videoUrl', title: 'Ссылка на видео (RUTUBE)', type: 'url' }),
            defineField({ name: 'duration', title: 'Длительность', type: 'string' }),
            defineField({ name: 'isFree', title: 'Бесплатный урок', type: 'boolean', initialValue: false }),
          ],
        },
      ],
    }),
  ],
})