import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const WIDTH = 800;
const HEIGHT = 500;

const DrawingCanvas = forwardRef(function DrawingCanvas({ color, size, tool}, ref) {
    const canvasRef = useRef(null);
    const drawing = useRef(false);
    const fillWhite = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    };
    useEffect(() => {
        fillWhite();
    }, []);
    useImperativeHandle(ref, () => ({
        clear: fillWhite,
        toBlob: () => new Promise((resolve) => canvasRef.current.toBlob(resolve,
            'image/png')),
    }));
    const pos = (e) => {
        const r = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - r.left) * (WIDTH / r.width),
            y: (e.clientY - r.top) * (HEIGHT / r.height),
        };
    };
    const start = (e) => {
        drawing.current = true;
        canvasRef.current.setPointerCapture(e.pointerId);
        const ctx = canvasRef.current.getContext('2d');
        const { x, y } = pos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };
    const move = (e) => {
        if (!drawing.current) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const { x, y } = pos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };
    const stop = () => {
        drawing.current = false;
    };
    return (
        <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className='canvas'
            aria-label='Zone de dessin'
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={stop}
            onPointerLeave={stop}
        />
    );
});
export default DrawingCanvas;