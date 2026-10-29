import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from
    "react";

const DrawingCanvas = forwardRef(function DrawingCanvas({ width = 600, height
    = 400 }, ref) {
    const canvasRef = useRef(null);
    const drawing = useRef(false);
    const [color, setColor] = useState("#0b3d91");
    const [size, setSize] = useState(6);
    const fillWhite = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
    };
    useEffect(() => {
        fillWhite();
    }, []);
    useImperativeHandle(ref, () => ({
        clear: fillWhite,
        toBlob: () =>
            new Promise((resolve) => canvasRef.current.toBlob(resolve,
                "image/png")),
    }));
    const pos = (e) => {
        const r = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - r.left) * (width / r.width),
            y: (e.clientY - r.top) * (height / r.height),
        };
    };
    const start = (e) => {
        drawing.current = true;
        canvasRef.current.setPointerCapture(e.pointerId);
        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = pos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };
    const move = (e) => {
        if (!drawing.current) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const { x, y } = pos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };
    const stop = () => {
        drawing.current = false;
    };
    return (
        <div className="draw-zone">
            <div className="toolbar">
                <input type="color" value={color} onChange={(e) =>
                    setColor(e.target.value)} />
                <input type="range" min="2" max="30" value={size} onChange={(e) =>
                    setSize(+e.target.value)} />
                <button type="button" onClick={() =>
                    setColor("#ffffff")}>Gomme</button>
                <button type="button" onClick={fillWhite}>Tout effacer</button>
            </div>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="canvas"
                onPointerDown={start}
                onPointerMove={move}
                onPointerUp={stop}
                onPointerLeave={stop}
            />
        </div>
    );
});
export default DrawingCanvas;