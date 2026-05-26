import { z } from "zod";

export const trackEventSchema = z.object({
  siteId: z.string().min(3).max(64),
  visitorId: z.string().min(3).max(64),
  sessionId: z.string().min(3).max(64),
  eventType: z.string().min(1).max(64),
  eventName: z.string().max(128).nullable().optional(),
  pageUrl: z.string().max(2048).optional(),
  pagePath: z.string().max(2048).optional(),
  pageTitle: z.string().max(512).optional(),
  referrer: z.string().max(2048).nullable().optional(),
  title: z.string().max(512).optional(),
  screenWidth: z.number().int().min(0).max(20000).optional(),
  screenHeight: z.number().int().min(0).max(20000).optional(),
  language: z.string().max(32).optional(),
  timezone: z.string().max(64).optional(),
  utm: z
    .object({
      source: z.string().max(128).nullable().optional(),
      medium: z.string().max(128).nullable().optional(),
      campaign: z.string().max(128).nullable().optional(),
      term: z.string().max(128).nullable().optional(),
      content: z.string().max(128).nullable().optional(),
    })
    .optional(),
  metadata: z.record(z.unknown()).optional(),
  occurredAt: z.string().datetime().optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;

export const signupSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});

export const createSiteSchema = z.object({
  name: z.string().min(1).max(120),
  domain: z.string().min(3).max(255),
  timezone: z.string().max(64).optional(),
});

export const updateSiteSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  domain: z.string().min(3).max(255).optional(),
  status: z.enum(["active", "paused"]).optional(),
  timezone: z.string().max(64).optional(),
});

export const conversionGoalSchema = z.object({
  name: z.string().min(1).max(120),
  goalType: z.enum([
    "button_click",
    "form_submit",
    "page_visit",
    "custom_event",
    "external_link",
    "whatsapp_click",
    "phone_click",
    "email_click",
  ]),
  matchingRule: z.record(z.unknown()),
  isActive: z.boolean().optional(),
});
