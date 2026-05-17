import { createApp } from "./app";

const app = createApp();
const PORT = Number(process.env.PORT ?? 3001);

app.listen(PORT, () => {
  console.log(`PackMate backend started on http://localhost:${PORT}`);
});
