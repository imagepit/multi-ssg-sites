// source.config.ts
import { defineConfig, defineDocs, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";
import { rehypeCode, rehypeCodeDefaultOptions, remarkStructure } from "fumadocs-core/mdx-plugins";

// src/lib/remark-adddel.ts
import { visit } from "unist-util-visit";
function remarkAddDelRegions() {
  return (tree) => {
    visit(tree, "code", () => {
    });
  };
}

// src/lib/remark-files-to-mdx.ts
import { visit as visit2 } from "unist-util-visit";
function remarkFilesToMdx() {
  return (tree) => {
    visit2(tree, "code", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      const lang = (node.lang || "").toLowerCase();
      if (lang !== "files") return;
      const value = String(node.value || "");
      const children = buildFilesAst(value);
      const filesNode = jsxEl("Files", [], children);
      parent.children[index] = filesNode;
    });
  };
}
function jsxEl(name, attrs = [], children = []) {
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: attrs.map((a) => ({ type: "mdxJsxAttribute", name: a.name, value: a.value })),
    children,
    data: { _mdxExplicitJsx: true }
  };
}
function buildFilesAst(text) {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/[\u2500-\u257F│├└┘┌┐┬┴├┤┼─┄┈┃╎]+/g, " ")).map((l) => l.replace(/^\s*[-*]\s+/, "")).filter((l) => l.trim().length > 0);
  const entries = lines.map((raw) => {
    const m = /^(\s*)(.*)$/.exec(raw);
    const lead = m[1] || "";
    const rest = (m[2] || "").trim();
    const leadSpaces = lead.replace(/\t/g, "  ").length;
    const indent = Math.floor(leadSpaces / 2);
    return { indent, label: rest };
  });
  const root = { children: [] };
  const stack = [root];
  for (let i = 0; i < entries.length; i++) {
    const { indent, label } = entries[i];
    const nextIndent = i + 1 < entries.length ? entries[i + 1].indent : indent;
    while (stack.length - 1 > indent) stack.pop();
    const isFolder = /\/$/.test(label) || nextIndent > indent;
    const name = label.replace(/\/$/, "");
    if (isFolder) {
      const folder = jsxEl("Folder", [{ name: "name", value: name }], []);
      last(stack).children.push(folder);
      stack.push(folder);
    } else {
      const file = jsxEl("File", [{ name: "name", value: name }], []);
      last(stack).children.push(file);
    }
  }
  return root.children;
}
function last(arr) {
  return arr[arr.length - 1];
}

// src/lib/remark-steps.ts
import { visit as visit3 } from "unist-util-visit";
function remarkStepBlocks() {
  return (tree) => {
    visit3(tree, "paragraph", () => {
    });
  };
}

// src/lib/remark-code-title.ts
import { visit as visit4 } from "unist-util-visit";
function remarkCodeTitleBeforeBlocks() {
  return (tree) => {
    visit4(tree, "code", () => {
    });
  };
}

// src/lib/remark-admonition-blocks.ts
import { visit as visit5 } from "unist-util-visit";
function remarkAdmonitionBlocks() {
  return (tree) => {
    visit5(tree, "paragraph", () => {
    });
  };
}

// src/lib/rehype-resolve-images.ts
import path from "path";
import { visit as visit6 } from "unist-util-visit";
function rehypeResolveImages(options) {
  const imagesDir = options?.imagesDir || path.join(process.cwd(), "public", "images");
  return function transformer(tree, file) {
    const filePath = typeof file?.path === "string" ? file.path : void 0;
    const baseDir = filePath ? path.dirname(filePath) : process.cwd();
    visit6(tree, "element", (node) => {
      if (node.tagName !== "img" || !node.properties) return;
      const rawSrc = String(node.properties.src || "");
      if (!rawSrc || rawSrc.startsWith("http") || rawSrc.startsWith("data:") || rawSrc.startsWith("blob:")) return;
      if (rawSrc.startsWith("/")) return;
      const hintIdx = rawSrc.replace(/\\/g, "/").lastIndexOf("images/");
      if (hintIdx >= 0) {
        node.properties.src = "/" + rawSrc.replace(/\\/g, "/").slice(hintIdx);
        return;
      }
      const absResolved = path.resolve(baseDir, rawSrc);
      const inImagesDir = absResolved.startsWith(imagesDir + path.sep);
      if (inImagesDir) {
        const rel = path.relative(imagesDir, absResolved).replace(/\\/g, "/");
        node.properties.src = `/images/${rel}`;
      }
    });
  };
}

// src/lib/rehype-next-image.ts
import fs from "fs";
import path2 from "path";
import { visit as visit7 } from "unist-util-visit";
function rehypeNextImage(options) {
  const imagesDir = options?.imagesDir || path2.join(process.cwd(), "public", "images");
  const defaultClass = options?.className || "markdown-image";
  const priority = options?.priority ?? false;
  return function transformer(tree) {
    visit7(tree, "element", (node) => {
      if (node.tagName !== "img" || !node.properties) return;
      const src = String(node.properties.src || "");
      if (!src || !src.startsWith("/images/")) return;
      const rel = src.replace(/^\/images\//, "");
      const abs = path2.join(imagesDir, rel);
      try {
        if (fs.existsSync(abs)) {
        }
      } catch {
      }
      node.tagName = "Image";
      const cn = String(node.properties.className || "");
      node.properties.className = cn ? `${cn} ${defaultClass}` : defaultClass;
      if (priority) node.properties.priority = true;
    });
  };
}

// src/lib/rehype-bash-class.ts
import { visit as visit8 } from "unist-util-visit";
function rehypeBashClass() {
  return (tree) => {
    visit8(tree, "element", () => {
    });
  };
}

// src/lib/shiki-raw-notation.ts
function transformerRawNotationDiff() {
  return () => ({});
}

// src/lib/shiki-bash-transformer.ts
function transformerBashClass() {
  return () => ({});
}

// source.config.ts
var SITE_ID = process.env.SITE_ID;
var docsDir = SITE_ID ? `../../contents/${SITE_ID}/contents` : "content";
var docs = defineDocs({
  dir: docsDir,
  docs: {
    schema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      date: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      cover: z.string().optional(),
      full: z.boolean().optional()
    }),
    files: [
      "**/*.{md,mdx}",
      "!**/README.md",
      "!**/AGENTS.md",
      "!**/CLAUDE.md"
    ]
  },
  meta: { schema: metaSchema }
});
var source_config_default = defineConfig({
  mdxOptions: {
    preset: "fumadocs",
    remarkPlugins: (v) => [
      remarkFilesToMdx,
      remarkStepBlocks,
      remarkCodeTitleBeforeBlocks,
      remarkAdmonitionBlocks,
      ...v,
      remarkAddDelRegions,
      [remarkStructure, { types: ["heading", "paragraph", "blockquote", "tableCell", "mdxJsxFlowElement", "code"] }]
    ],
    rehypePlugins: (v) => {
      const base = Array.isArray(v) ? v : [];
      const enhanced = base.map((p) => {
        if (Array.isArray(p) && p[0] === rehypeCode) {
          const baseOptions = p[1] || {};
          return [rehypeCode, {
            ...baseOptions,
            transformers: [
              ...baseOptions.transformers || rehypeCodeDefaultOptions.transformers || [],
              transformerRawNotationDiff(),
              transformerBashClass()
            ]
          }];
        }
        if (p === rehypeCode || typeof p === "function" && p.name === "rehypeCode") {
          return [rehypeCode, {
            transformers: [
              ...rehypeCodeDefaultOptions.transformers || [],
              transformerRawNotationDiff(),
              transformerBashClass()
            ]
          }];
        }
        return p;
      });
      return [
        rehypeResolveImages,
        rehypeNextImage,
        ...enhanced,
        rehypeBashClass
      ];
    }
  }
});
export {
  source_config_default as default,
  docs
};
