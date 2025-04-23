import app from "./app.js";
import { portServer } from "./constants.js";

const port = portServer || 8080;
app.listen(port, () => {
  console.log(`server is running`);
});
