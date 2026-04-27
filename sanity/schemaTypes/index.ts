import { type SchemaTypeDefinition } from 'sanity'
import { course } from './course'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [course],
}