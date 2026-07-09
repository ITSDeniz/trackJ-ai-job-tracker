import { loadConfig } from "./config/loadConfig.js";
import { createServer } from "./delivery/http/createServer.js";

const config = loadConfig();
const app = createServer();

app.listen(config.port, () => {
  console.log(`TrackJ API listening on port ${config.port}`);
});
