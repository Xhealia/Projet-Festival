import { useEffect, useRef, useState } from "react";
import DrawingCanvas from "./components/DrawingCanvas.jsx";
import Aquarium from "./components/Aquarium.jsx";
import { submitDrawing, listDrawings } from "./api.js";
import "./App.css";


const MESSAGES = {
  idle: "",
  loading: "Analyse de ton dessin en cours...",
  approved: "Dessin validé ! Il nage maintenant dans l\"aquarium.",
  rejected: "Ce dessin a été refusé par la modération.",
  error: "Une erreur est survenue, réessaie plus tard.",
};

export default function App() {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [drawings, setDrawings] = useState([]);
  useEffect(() => {
    listDrawings().then(setDrawings).catch(() => { });
  }, []);
  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const blob = await canvasRef.current.toBlob();
      const result = await submitDrawing(blob);
      if (result.status === "approved") {
        setDrawings((d) => [...d, { id: result.id, url: result.url }]);
        canvasRef.current.clear();
        setStatus("approved");
      } else if (result.status === "rejected") {
        setStatus("rejected");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };
  return (
    <main>
      <h1>Atelier sous-marin animé</h1>
      <DrawingCanvas ref={canvasRef} />
      <button onClick={handleSubmit} disabled={status === "loading"}>Envoyer
        mon dessin</button>
      <p role="status">{MESSAGES[status]}</p>
      <Aquarium drawings={drawings} />
    </main>
  );
}
