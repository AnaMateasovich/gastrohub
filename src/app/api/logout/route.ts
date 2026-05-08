
export async function POST() {
  const response = new Response("Logout");

  response.headers.set("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");

  return response;
}
