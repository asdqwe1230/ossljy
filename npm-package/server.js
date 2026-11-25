const http = require("http");
const calculator = require("./index");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/add") {
    const a = Number(url.searchParams.get("a"));
    const b = Number(url.searchParams.get("b"));

    const result = calculator.add(a, b);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ result }));
  } else {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("OSSJY Calculator Docker Server");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});