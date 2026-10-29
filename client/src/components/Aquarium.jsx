function swimParams(id) {
    const n = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return {
        top: 5 + (n % 70),
        duration: 14 + (n % 12),
        delay: -(n % 14),
        size: 100 + (n % 80),
    };
}
export default function Aquarium({ drawings }) {
    return (
        <section className='aquarium' aria-label='Aquarium'>
            {drawings.map(({ id, url }) => {
                const p = swimParams(id);
                return (
                    <div
                        key={id}
                        className='fish'
                        style={{
                            top: `${p.top}%`, '--dur': `${p.duration}s`, '--delay':
                                `${p.delay}s`
                        }}
                    >
                        <img src={url} alt='Dessin animé' style={{ width: p.size }} />
                    </div>
                );
            })}
        </section >
    );
}
