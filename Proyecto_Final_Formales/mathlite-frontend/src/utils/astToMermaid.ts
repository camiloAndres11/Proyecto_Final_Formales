import type { Theme } from "../store/themeStore";

function escape(s: string): string {
  return s.replace(/"/g, "#quot;").replace(/[\n\r]/g, " ");
}

function truncate(s: string, max = 60): string {
  return s.length > max ? s.slice(0, max) + "..." : s;
}

const THEMES: Record<Theme, Record<string, string>> = {
  dark: {
    primaryColor: "#31363f",
    primaryTextColor: "#eeeeee",
    primaryBorderColor: "#76abae",
    lineColor: "#76abae",
    mainBkg: "#222831",
    nodeBorder: "#76abae",
    fontSize: "14px",
  },
  light: {
    primaryColor: "#e0e3e8",
    primaryTextColor: "#222831",
    primaryBorderColor: "#5a9a9d",
    lineColor: "#5a9a9d",
    mainBkg: "#eeeeee",
    nodeBorder: "#5a9a9d",
    fontSize: "14px",
  },
};

export function getMermaidThemeConfig(theme: Theme) {
  return { theme: "base" as const, themeVariables: THEMES[theme] };
}

export function astToMermaid(ast: Record<string, unknown>): string {
  let counter = 0;
  const declarations: string[] = [];
  const connections: string[] = [];

  function traverse(
    node: unknown,
    parentId?: string,
    edgeLabel?: string
  ): string | null {
    if (node === null || node === undefined) return null;

    const id = `n${counter++}`;

    if (Array.isArray(node)) {
      declarations.push(`${id}["Array[${node.length}]"]`);
      if (parentId) {
        const label = edgeLabel ? `|"${escape(truncate(edgeLabel))}"|` : "";
        connections.push(`${parentId} --> ${label} ${id}`);
      }
      node.forEach((item, i) => traverse(item, id, String(i)));
    } else if (typeof node === "object") {
      const obj = node as Record<string, unknown>;
      const typeName = (obj.type as string) || "Object";
      declarations.push(`${id}["${escape(truncate(typeName))}"]`);
      if (parentId) {
        const label = edgeLabel ? `|"${escape(truncate(edgeLabel))}"|` : "";
        connections.push(`${parentId} --> ${label} ${id}`);
      }
      for (const [key, val] of Object.entries(obj)) {
        if (key === "type") continue;
        traverse(val, id, key);
      }
    } else {
      const val = escape(truncate(String(node)));
      declarations.push(`${id}["${val}"]`);
      if (parentId) {
        const label = edgeLabel ? `|"${escape(truncate(edgeLabel))}"|` : "";
        connections.push(`${parentId} --> ${label} ${id}`);
      }
    }

    return id;
  }

  traverse(ast);

  if (declarations.length === 0) {
    return "graph TD";
  }

  return [
    "graph TD",
    ...declarations.map((d) => `  ${d}`),
    ...connections.map((c) => `  ${c}`),
  ].join("\n");
}