const { FuseBox } = require("fuse-box");

const fuse = FuseBox.init({
  homeDir: "src",
  output: "build/$name.js",
})

fuse.bundle("app")

fuse.run();
