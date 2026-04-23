import { pgTable, text, timestamp, integer, boolean, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'cancelled', 'pending']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  password: text('password'),
  phone: text('phone'),
  cedula: text('cedula'),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
});

export const coverages = pgTable('coverages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const coveragesRelations = relations(coverages, ({ many }) => ({
  planCoverages: many(planCoverages),
  subscriptionCoverages: many(subscriptionCoverages),
}));

export const plans = pgTable('plans', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const plansRelations = relations(plans, ({ many }) => ({
  planCoverages: many(planCoverages),
  subscriptions: many(subscriptions),
}));

export const planCoverages = pgTable('plan_coverages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  planId: text('plan_id').notNull().references(() => plans.id, { onDelete: 'cascade' }),
  coverageId: text('coverage_id').notNull().references(() => coverages.id, { onDelete: 'cascade' }),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: text('plan_id').notNull().references(() => plans.id),
  status: subscriptionStatusEnum('status').default('pending').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  payphoneTransactionId: text('payphone_transaction_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptionCoverages = pgTable('subscription_coverages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  subscriptionId: text('subscription_id').notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  coverageId: text('coverage_id').notNull().references(() => coverages.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').default(true).notNull(),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  subscriptionId: text('subscription_id').notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  date: timestamp('date').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  paymentMethod: text('payment_method'),
  payphoneReference: text('payphone_reference'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  subscriptions: many(subscriptions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
  subscriptionCoverages: many(subscriptionCoverages),
  payments: many(payments),
}));

export const subscriptionCoveragesRelations = relations(subscriptionCoverages, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [subscriptionCoverages.subscriptionId],
    references: [subscriptions.id],
  }),
  coverage: one(coverages, {
    fields: [subscriptionCoverages.coverageId],
    references: [coverages.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const planCoveragesRelations = relations(planCoverages, ({ one }) => ({
  plan: one(plans, {
    fields: [planCoverages.planId],
    references: [plans.id],
  }),
  coverage: one(coverages, {
    fields: [planCoverages.coverageId],
    references: [coverages.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Coverage = typeof coverages.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Payment = typeof payments.$inferSelect;