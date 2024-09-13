const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs-extra");
const copy = require("esbuild-plugin-copy").default;

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    target: "node20", // Target depends on your environment
    outdir: "build",
    external: ["express"], // Specify Node.js packages here
    loader: {
      ".ts": "ts",
    },
    plugins: [
      copy({
        assets: [
          {
            from: ["node_modules/swagger-ui-dist/*"],
            to: ["swagger-ui-dist"],
          },
          {
            from: ["src/docs/swagger.json"],
            to: ["docs/swagger.json"],
          },
          {
            from: ["src/config/.env"],
            to: ["config"],
          },
          {
            from: ["ecosystem.config.js"],
            to: ["ecosystem.config.js"],
          },
        ],
      }),
    ],
    resolveExtensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"), // Ensure this points to the 'src' folder
    },
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  })
  .then(() => {
    fs.copySync(
      path.resolve(__dirname, "src/docs/swagger.json"),
      path.resolve(__dirname, "build/docs/swagger.json")
    );
    console.log("Swagger JSON copied successfully!");

    fs.copySync(
      path.resolve(__dirname, "package.json"),
      path.resolve(__dirname, "build/package.json")
    );
    console.log("Package.json copied successfully!");

    fs.copySync(
      path.resolve(__dirname, "ecosystem.config.js"),
      path.resolve(__dirname, "build/ecosystem.config.js")
    );
    console.log("Ecosystem Config copied successfully!");
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
