import { readFile } from "node:fs/promises"; import path from "node:path"
const root = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/[A-Z]:/, (m) => m.slice(1)))
const js = await readFile(path.join(root, "showcase/showcase.js"), "utf8"); const css = await readFile(path.join(root, "showcase/showcase.css"), "utf8")
const required = [[js, "reduced-motion", "reduced-motion handling"], [js, "selectedLifecycle", "lifecycle filtering"], [js, "selectedPersonality", "personality filtering"], [js, "selectedKind", "asset-kind filtering"], [js, "grammarFor", "visual grammar metadata"], [js, "prohibitedUsage", "usage guard metadata"], [js, "Preview unavailable", "preview failure state"], [js, "loading=\"lazy\"", "lazy loading"], [js, "compact", "compact discovery mode"], [css, "background-size:24px 24px", "checkerboard preview surface"], [css, "focus-visible", "keyboard focus styling"]]
for (const [source, needle, label] of required) if (!source.includes(needle)) throw new Error(`missing explorer contract: ${label}`)
const v2Pages=["showcase/v2/index.html","showcase/v2/graph-grammar.html","showcase/v2/data-viz.html","showcase/v2/typography.html","showcase/v2/color.html","showcase/v2/personalities.html","showcase/v2/cinematic-editorial.html","showcase/v2/semantic-primitives.html"];
for(const rel of v2Pages) await readFile(path.join(root,rel),"utf8");
console.log("explorerContract reducedMotion=true failureFallback=true lazyPreviews=true compactMode=true checkerboard=true focusVisible=true lifecycle=true personality=true kind=true visualSystemV2Galleries=7")
