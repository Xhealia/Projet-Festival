export async function submitDrawing(blob) {
    const fd = new FormData();
    fd.append("image", blob, "drawing.png");
    const res = await fetch("/api/drawings", {method: "POST", body: fd});
    const data = await res.json().catch(()=> ({}));
    return { httpStatus: res.status, ...data};
}

export async function listDrawings() {
    const res = await fetch("/api/drawings");
    if (!res.ok) throw new Error("Liste indisponible");
    return res.json();
}