import { readFile } from "node:fs/promises"; import path from "node:path"
const root = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/[A-Z]:/, (m) => m.slice(1)))
const js = await readFile(path.join(root, "showcase/showcase.js"), "utf8"); const css = await readFile(path.join(root, "showcase/showcase.css"), "utf8")
const required = [[js, "reduced-motion", "reduced-motion handling"], [js, "Preview unavailable", "preview failure state"], [js, "loading=\"lazy\"", "lazy loading"], [js, "compact", "compact discovery mode"], [css, "background-size:24px 24px", "checkerboard preview surface"], [css, "focus-visible", "keyboard focus styling"]]
for (const [source, needle, label] of required) if (!source.includes(needle)) throw new Error(`missing explorer contract: ${label}`)
console.log("explorerContract reducedMotion=true failureFallback=true lazyPreviews=true compactMode=true checkerboard=true focusVisible=true")
