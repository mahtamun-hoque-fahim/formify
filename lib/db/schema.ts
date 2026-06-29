import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'

// Enums
export const roleEnum = pgEnum('role', ['user', 'admin'])
export const planEnum = pgEnum('plan', ['free', 'pro', 'team'])

// Users
export const users = pgTable('users', {
  id:            text('id').primaryKey(),
  email:         text('email').notNull().unique(),
  name:          text('name').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image:         text('image'),
  role:          roleEnum('role').notNull().default('user'),
  // plan: free by default. Admin always bypasses plan limits regardless of this value.
  plan:          planEnum('plan').notNull().default('free'),
  createdAt:     timestamp('created_at').notNull().defaultNow(),
  updatedAt:     timestamp('updated_at').notNull().defaultNow(),
})

// Better Auth standard tables
export const sessions = pgTable('sessions', {
  id:             text('id').primaryKey(),
  expiresAt:      timestamp('expires_at').notNull(),
  token:          text('token').notNull().unique(),
  createdAt:      timestamp('created_at').notNull(),
  updatedAt:      timestamp('updated_at').notNull(),
  ipAddress:      text('ip_address'),
  userAgent:      text('user_agent'),
  userId:         text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('accounts', {
  id:                   text('id').primaryKey(),
  accountId:            text('account_id').notNull(),
  providerId:           text('provider_id').notNull(),
  userId:               text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken:          text('access_token'),
  refreshToken:         text('refresh_token'),
  idToken:              text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt:timestamp('refresh_token_expires_at'),
  scope:                text('scope'),
  password:             text('password'),
  createdAt:            timestamp('created_at').notNull(),
  updatedAt:            timestamp('updated_at').notNull(),
})

export const verifications = pgTable('verifications', {
  id:         text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value:      text('value').notNull(),
  expiresAt:  timestamp('expires_at').notNull(),
  createdAt:  timestamp('created_at'),
  updatedAt:  timestamp('updated_at'),
})

// Forms
export const forms = pgTable('forms', {
  id:            text('id').primaryKey(),
  userId:        text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:         text('title').notNull(),
  slug:          text('slug').notNull().unique(),
  description:   text('description'),
  // fields: ordered array of field definitions
  // [{ id, type, label, required, options?, conditional? }]
  fields:        jsonb('fields').notNull().default([]),
  // settings: quiz mode, tab detection, deadline, password, theme, thank-you msg
  settings:      jsonb('settings').notNull().default({}),
  isPublished:   boolean('is_published').notNull().default(false),
  // responseCount: incremented on each submission for plan limit checks
  responseCount: integer('response_count').notNull().default(0),
  deletedAt:     timestamp('deleted_at'),
  createdAt:     timestamp('created_at').notNull().defaultNow(),
  updatedAt:     timestamp('updated_at').notNull().defaultNow(),
})

// Responses
export const responses = pgTable('responses', {
  id:          text('id').primaryKey(),
  formId:      text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  // answers: map of fieldId -> answer value
  answers:     jsonb('answers').notNull().default({}),
  // violations: [{ timestamp, type: 'blur' | 'visibility' }]
  violations:  jsonb('violations').notNull().default([]),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  deletedAt:   timestamp('deleted_at'),
  // hashed respondent IP for abuse detection
  ipHash:      text('ip_hash'),
})

// Templates
export const templates = pgTable('templates', {
  id:           text('id').primaryKey(),
  title:        text('title').notNull(),
  description:  text('description'),
  category:     text('category').notNull(),
  fields:       jsonb('fields').notNull().default([]),
  previewImage: text('preview_image'),
  isPublic:     boolean('is_public').notNull().default(true),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

// Types
export type User       = typeof users.$inferSelect
export type Form       = typeof forms.$inferSelect
export type Response   = typeof responses.$inferSelect
export type Template   = typeof templates.$inferSelect
