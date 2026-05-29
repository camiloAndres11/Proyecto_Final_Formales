import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEditorStore } from "../store/editorStore";

export default function MainLayout() {
  const navigate = useNavigate();
  const setCode = useEditorStore((s) => s.setCode);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        onSelectExample={(code) => {
          setCode(code);
          navigate("/");
        }}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
