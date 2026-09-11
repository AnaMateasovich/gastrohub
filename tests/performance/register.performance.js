import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate, Counter } from "k6/metrics"; 

export const options = {
  vus: 5,
  duration: "20s",
};
// Métricas personalizadas
const registerDuration = new Trend("register_duration", true);
const registerErrors = new Rate("register_errors");
const prismaErrors = new Counter("prisma_errors");
const validationErrors = new Counter("validation_errors");

const BASE_URL = __ENV.BASE_URL || "http://lvh.me:3000";
const NEXT_ACTION_ID = "40d16f3163be75eba68bcafddb50b0d48e532a988d";
const ROUTER_STATE_TREE =
  "%5B%22%22%2C%7B%22children%22%3A%5B%22(auth)%22%2C%7B%22children%22%3A%5B%22register%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D";

export default function () {
  // ID único por VU + iteración, para no chocar con slug/email duplicados
  const uid = `${__VU}-${__ITER}-${Date.now()}`;

  const body = JSON.stringify([
    {
      companyName: `Load Test Org ${uid}`,
      slug: `load-test-${uid}`,
      ownerName: "Pedro Test",
      ownerEmail: `loadtest-${uid}@mail.com`,
      ownerPassword: "Pedro123",
      ownerPasswordConfirm: "Pedro123",
      plan: "FREE",
      acceptTerms: true,
    },
  ]);

  const params = {
    headers: {
      Accept: "text/x-component",
      "Content-Type": "text/plain;charset=UTF-8",
      Origin: BASE_URL,
      Referer: `${BASE_URL}/register`,
      "next-action": NEXT_ACTION_ID,
      "next-router-state-tree": ROUTER_STATE_TREE,
    },
  };
  const start = Date.now();
  const res = http.post(`${BASE_URL}/register`, body, params);
  const duration = Date.now() - start;
  registerDuration.add(duration);
  const hasPrismaError = res.body.includes("PrismaClientKnownRequestError");
  const hasValidationError = res.body.includes("ZodError");
  if (hasPrismaError) {
    prismaErrors.add(1);
  }
  if (hasValidationError) {
    validationErrors.add(1);
  }
  const success = check(res, {
    "status 200": (r) => r.status === 200,
    "no dice error de prisma": (r) =>
      !r.body.includes("PrismaClientKnownRequestError"),
    "no dice error de validacion": (r) => !r.body.includes("ZodError"),
  });
  registerErrors.add(!success);
  sleep(1);
}
