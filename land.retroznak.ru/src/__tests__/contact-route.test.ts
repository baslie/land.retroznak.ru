import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ContactFormSchema } from "@/validation/contactForm";
import { contactFormSchema } from "@/validation/contactForm";
import type { ContactFormResponse } from "@/types/forms";
import { POST } from "@app/api/forms/contact/route";

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
  const sendMail = vi.fn();
  const createTransport = vi.fn(() => ({ sendMail }));
  return { sendMailMock: sendMail, createTransportMock: createTransport };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

const REQUIRED_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "MAIL_TO",
  "MAIL_FROM",
  "SMTP_SECURE",
];

const originalEnv: Partial<Record<string, string>> = {};

REQUIRED_ENV_KEYS.forEach((key) => {
  const value = process.env[key];
  if (typeof value !== "undefined") {
    originalEnv[key] = value;
  }
});

function setValidEnv() {
  process.env.SMTP_HOST = "smtp.example.com";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = "mailer@example.com";
  process.env.SMTP_PASSWORD = "secret";
  process.env.MAIL_TO = "team@example.com";
  process.env.MAIL_FROM = "Retroznak <mailer@example.com>";
  process.env.SMTP_SECURE = "false";
}

function restoreEnv() {
  for (const key of REQUIRED_ENV_KEYS) {
    const originalValue = originalEnv[key];
    if (typeof originalValue === "undefined") {
      delete process.env[key];
    } else {
      process.env[key] = originalValue;
    }
  }
}

function buildRequestBody(overrides: Partial<ContactFormSchema> = {}) {
  const base: ContactFormSchema = contactFormSchema.parse({
    name: "Иван",
    phone: "+7 999 000-00-00",
    contactReason: "callback",
    consent: true,
    messenger: "telegram",
    examplesRequested: true,
  });

  return { ...base, ...overrides };
}

beforeEach(() => {
  setValidEnv();
  sendMailMock.mockResolvedValue({ messageId: "test" });
  createTransportMock.mockReturnValue({ sendMail: sendMailMock });
});

afterEach(() => {
  sendMailMock.mockReset();
  createTransportMock.mockClear();
  restoreEnv();
});

describe("POST /api/forms/contact", () => {
  it("returns success for a valid payload", async () => {
    const payload = buildRequestBody();

    const response = await POST(
      new Request("http://localhost/api/forms/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );

    const data = (await response.json()) as ContactFormResponse;

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(sendMailMock).toHaveBeenCalledOnce();
    expect(sendMailMock.mock.calls[0]?.[0]).toMatchObject({
      to: "team@example.com",
      subject: expect.stringContaining("Retroznak"),
    });
  });

  it("validates request payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/forms/contact", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    const data = (await response.json()) as ContactFormResponse;

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("fails gracefully when mailer config is missing", async () => {
    delete process.env.SMTP_HOST;

    const payload = buildRequestBody({ name: "Пользователь", contactReason: "question" });

    const response = await POST(
      new Request("http://localhost/api/forms/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );

    const data = (await response.json()) as ContactFormResponse;

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});
