import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";


export const userTable = pgTable("user", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull()
});

export const categoryTable = pgTable("category", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
    products: many(productsTable),
}));

export const productsTable = pgTable ("products", {
    id: uuid().primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => categoryTable.id),
    name: text().notNull(), 
    slug: text().notNull().unique(),
    description: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productsRelations = relations(productsTable, ({ one, many }) => {
    return {
        category: one(categoryTable, {
            fields: [productsTable.categoryId],
            references: [categoryTable.id], 
        }),
        
        variants: many(productsVariantsTable),
    }
});

export const productsVariantsTable = pgTable ("product_variants", {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid("product_id")
        .notNull()
        .references(() => productsTable.id),
    name: text().notNull(),
    slug: text().notNull().unique(),
    color: text().notNull(),
    priceInCents: integer("price_in_cents").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});