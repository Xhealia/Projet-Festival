const COLORS = ['#000000', '#0b3d91', '#1e90ff', '#2ecc71', '#f1c40f',
    '#e67e22', '#e74c3c', '#8e44ad'];
export default function ColorPalette({ color, onChange }) {
    return (
        <section className='panel' aria-label='Couleurs'>
            <h2>Couleurs</h2>
            <div className='swatches'>
                {COLORS.map((c) => (
                    <button
                        key={c}
                        type='button'
                        className={`swatch ${c === color ? 'selected' : ''}`}
                        style={{ background: c }}
                        onClick={() => onChange(c)}
                        aria-label={`Couleur ${c}`}
                        aria-pressed={c === color}
                    />
                ))}
            </div>
        </section>
    );
}