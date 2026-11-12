export default function ToolPanel({ tool, onToolChange, size, onSizeChange,onClear }) {
    return (
        <section className='panel' aria-label='Outils de dessin'>
            <h2>Outils</h2>
            <div className='tools'>
                <button type='button' aria-pressed={tool === 'pen'} onClick={() =>
                    onToolChange('pen')}>
                    Pinceau
                </button>
                <button type='button' aria-pressed={tool === 'eraser'} onClick={() =>
                    onToolChange('eraser')}>
                    Gomme
                </button>
            </div>
            <label className='size'>
                Épaisseur
                <input
                    type='range'
                    min='2'
                    max='30'
                    value={size}
                    onChange={(e) => onSizeChange(Number(e.target.value))}
                />
            </label>
            <button type='button' onClick={onClear}>Tout effacer</button>
        </section>
    );
}
