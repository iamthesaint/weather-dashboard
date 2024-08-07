import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
// use res.sendFile() to send the index.html file
// use path.join()
// * switch _req to req if needed

router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

export default router;
