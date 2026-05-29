import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";
import { useThemeStore } from "../store/themeStore";

const examplePrograms = [
  {
    name: "Aritmética",
    description: "Operaciones básicas",
    code: "let x = 5\nlet y = 3\nlet z = x + y * 2\nprint(z)\nprint(x ^ y)",
  },
  {
    name: "If/Else",
    description: "Control de flujo",
    code: "let x = 15\nif x > 10 {\n  print(\"mayor\")\n} else {\n  print(\"menor\")\n}",
  },
  {
    name: "While",
    description: "Iteración",
    code: "let i = 1\nwhile i <= 5 {\n  print(i)\n  let i = i + 1\n}",
  },
  {
    name: "Trigonométricas",
    description: "Funciones math",
    code: "print(sin(0))\nprint(cos(0))\nprint(sqrt(25))\nprint(abs(-10))",
  },
  {
    name: "Comparaciones",
    description: "Lógica booleana",
    code: "let a = 10\nlet b = 20\nprint(a == b)\nprint(a != b)\nprint(a < b)\nprint(a > b)\nprint(true and false)\nprint(true or false)",
  },
];

interface SidebarProps {
  onSelectExample: (code: string) => void;
}

export default function Sidebar({ onSelectExample }: SidebarProps) {
  const { theme, toggle } = useThemeStore();

  return (
    <aside className="w-64 flex flex-col h-full bg-surface border-r border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative p-5 border-b border-border">
        <div className="flex items-center gap-2.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_6px_rgba(201,168,76,0.5)]" />
          <h1 className="text-lg font-display font-semibold tracking-tight text-text">
            MathLite
          </h1>
        </div>
        <p className="text-xs text-text-muted font-sans ml-[18px]">
          Intérprete de DSL
        </p>
      </div>

      <nav className="relative flex-1 p-3 space-y-0.5 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
              isActive
                ? "text-gold-light bg-gold/10 shadow-[inset_0_0_0_1px_rgba(201,168,76,0.15)]"
                : "text-text-muted hover:text-text-secondary hover:bg-surface-hover"
            )
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
          </svg>
          Playground
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
              isActive
                ? "text-gold-light bg-gold/10 shadow-[inset_0_0_0_1px_rgba(201,168,76,0.15)]"
                : "text-text-muted hover:text-text-secondary hover:bg-surface-hover"
            )
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial
        </NavLink>
      </nav>

      <div className="relative p-3 border-t border-border">
        <div className="flex items-center gap-2 px-3 mb-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-text-muted font-medium tracking-widest uppercase">
            Ejemplos
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="space-y-0.5">
          {examplePrograms.map((ex) => (
            <button
              key={ex.name}
              onClick={() => onSelectExample(ex.code)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group",
                "hover:bg-surface-hover"
              )}
            >
              <span className="block text-xs font-medium text-text-secondary group-hover:text-gold-light transition-colors">
                {ex.name}
              </span>
              <span className="block text-[10px] text-text-muted mt-px">
                {ex.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative p-3 border-t border-border">
        <button
          onClick={toggle}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
            "text-text-muted hover:text-text-secondary hover:bg-surface-hover"
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            {theme === "dark" ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            )}
          </svg>
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>
      </div>
    </aside>
  );
}
