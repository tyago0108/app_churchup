import { useState } from "react";
import Profile from "./Profile";
import Churches from "./Churches";
import Events from "./Events";

export default function Dashboard() {
  const [active, setActive] = useState("perfil");

  return (
    <div style={{ display: "flex" }}>
      
      {/* MENU */}
      <aside style={{ width: 200 }}>
        <button onClick={() => setActive("perfil")}>Perfil</button>
        <button onClick={() => setActive("igrejas")}>Igrejas</button>
        <button onClick={() => setActive("eventos")}>Eventos</button>
      </aside>

      {/* CONTEÚDO */}
      <main style={{ padding: 20 }}>
        {active === "perfil" && <Profile />}
        {active === "igrejas" && <Churches />}
        {active === "eventos" && <Events />}
      </main>

    </div>
  );
}