import { app, ensureSeeded } from './app.js';

const PORT = Number(process.env.PORT || 3001);

await ensureSeeded();

app.listen(PORT, () => {
  console.log(`API server listening on http://127.0.0.1:${PORT}`);
});
