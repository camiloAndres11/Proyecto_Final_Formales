import { cn } from "../utils/cn";

const examplePrograms = [
  {
    name: "Aritmética",
    code: "let x = 5\nlet y = 3\nlet z = x + y * 2\nprint(z)\nprint(x ^ y)",
  },
  {
    name: "If/Else",
    code: "let x = 15\nif x > 10 {\n  print(\"mayor\")\n} else {\n  print(\"menor\")\n}",
  },
  {
    name: "While",
    code: "let i = 1\nwhile i <= 5 {\n  print(i)\n  let i = i + 1\n}",
  },
  {
    name: "Trigonométricas",
    code: "print(sin(0))\nprint(cos(0))\nprint(sqrt(25))\nprint(abs(-10))",
  },
  {
    name: "Comparaciones",
    code: "let a = 10\nlet b = 20\nprint(a == b)\nprint(a != b)\nprint(a < b)\nprint(a > b)\nprint(true and false)\nprint(true or false)",
  },
];

interface SidebarProps {
  onSelectExample: (code: string) => void;
}

export default function Sidebar({ onSelectExample }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-lg font-bold tracking-tight text-white">
          MathLite
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">Intérprete DSL</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <a
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 bg-zinc-900"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Playground
        </a>
        <a
          href="/history"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Historial
        </a>
      </nav>

      <div className="p-3 border-t border-zinc-800">
        <p className="text-xs text-zinc-600 mb-2 uppercase tracking-wider font-medium">
          Ejemplos
        </p>
        <div className="space-y-1">
          {examplePrograms.map((ex) => (
            <button
              key={ex.name}
              onClick={() => onSelectExample(ex.code)}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-lg text-xs",
                "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900",
                "transition-colors font-mono truncate"
              )}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
