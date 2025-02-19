import next from "next";
import { createServer } from "http";
const app = next({
  dev: false, // 
  dir: ".", //
});

const handle = app.getRequestHandler();
await app.prepare();

const serve = (handler: (req: any, res: any) => Promise<Response>) => {
  const server = createServer(async (req, res) => {
    const response = await handler(req, res);
    res.writeHead(response.status, response.statusText);
    res.end(await response.text());
  });
  server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
};
await app.prepare();

serve(async (req, res) => {
  try {
    await handle(req, res);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Server-side error:", error); // Log the error!
    return new Response("Internal Server Error", { status: 500 });
  }
});