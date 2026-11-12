import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DrawingCanvas from '../components/DrawingCanvas.jsx';
import ColorPalette from '../components/ColorPalette.jsx';
import ToolPanel from '../components/ToolPanel.jsx';
import { submitDrawing } from '../api.js';
const MESSAGES = {
    loading: 'Analyse de ton dessin en cours...',
    approved: 'Dessin validé ! Il nage maintenant dans l’aquarium.',
    rejected: 'Ce dessin n’a pas été accepté par la modération. Tu peux en dessiner un autre.',
    error: 'Une erreur est survenue, réessaie dans un instant.',
};
export default function DrawPage() {
    const canvasRef = useRef(null);
    const [color, setColor] = useState('#0b3d91');
    const [size, setSize] = useState(8);
    const [tool, setTool] = useState('pen');
    const [status, setStatus] = useState('idle');
    const handleSubmit = async () => {
        setStatus('loading');
        try {
            const blob = await canvasRef.current.toBlob();
            const result = await submitDrawing(blob);
            if (result.status === 'approved') {
                canvasRef.current.clear();
                setStatus('approved');
            } else if (result.status === 'rejected') {
                setStatus('rejected');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };
    return (
        <section className='draw-page'>
            <h1>Dessine ta créature marine</h1>
            <div className='draw-layout'>
                <DrawingCanvas ref={canvasRef} color={color} size={size} tool={tool}
                />
                <aside className='sidebar'>
                    <ColorPalette
                        color={color}
                        onChange={(c) => {
                            setColor(c);
                            setTool('pen');
                        }}
                    />
                    <ToolPanel
                        tool={tool}
                        onToolChange={setTool}
                        size={size}
                        onSizeChange={setSize}
                        onClear={() => canvasRef.current.clear()}
                    />
                    <button type='button' className='primary' onClick={handleSubmit}
                        disabled={status === 'loading'}>
                        Envoyer mon dessin
                    </button>
                    <p role='status' className={`message ${status}`}>{MESSAGES[status]}
                    </p>
                    {status === 'approved' && (
                        <Link to='/aquarium' className='link-button'>Voir
                            l’aquarium</Link>
                    )}
                </aside>
            </div>
        </section>
    );
}