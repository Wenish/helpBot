const { FuseBox } = require("fuse-box");

const fuse = FuseBox.init({
  homeDir: "src",
  output: "build/$name.js",
  target : "server@esnext",
})

fuse.bundle("app")
  .instructions(`app.js`);

fuse.run();
