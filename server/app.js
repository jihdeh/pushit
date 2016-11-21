import koa from "koa";
import forward from "koa-forward-request";
import mount from "koa-mount";
import Frontend from "./frontend";
import Api from "./api";

function App() {
  const app = koa();

  forward(app);
  app
    .use(mount("/api", Api()))
    .use(mount("/", Frontend()))

  return app;
}
export default App;
