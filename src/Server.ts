import config from "./Config/index";
import app from "./App";

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
