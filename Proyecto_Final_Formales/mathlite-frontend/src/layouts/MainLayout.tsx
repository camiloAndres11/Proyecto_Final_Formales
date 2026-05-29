import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEditorStore } from "../store/editorStore";
import { useThemeStore } from "../store/themeStore";

export default function MainLayout() {
  const navigate = useNavigate();
  const setCode = useEditorStore((s) => s.setCode);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex h-screen bg-bg text-text overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none z-0" />
      <div className="absolute inset-0 bg-grid pointer-events-none z-0 opacity-50" />
      <Sidebar
        onSelectExample={(code) => {
          setCode(code);
          navigate("/");
        }}
      />
      <div className="relative flex-1 flex flex-col overflow-hidden z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent pointer-events-none" />
        <Outlet />
      </div>
    </div>
  );
}
