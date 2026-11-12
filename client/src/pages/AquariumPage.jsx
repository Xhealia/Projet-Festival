import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Aquarium from '../components/Aquarium.jsx';
import { listDrawings } from '../api.js';

export default function AquariumPage() {
    const [drawings, setDrawings] = useState([]);
    const [state, setState] = useState('loading');
    useEffect(() => {
        listDrawings()
            .then((list) => {
                setDrawings(list);
                setState('ready');
            })
            .catch(() => setState('error'));
    }, []);
    return (
        <section className='aquarium-page'>
            <h1>L’aquarium</h1>
            {state === 'loading' && <p>Chargement...</p>}
            {state === 'error' && <p className='message error'>Impossible de
                charger les dessins.</p>}
            {state === 'ready' && drawings.length === 0 && (
                <p>
                    L’aquarium est vide. <Link to='/'>Dessine la première créature !
                    </Link>
                </p>
            )}
            {state === 'ready' && drawings.length > 0 && <Aquarium drawings=
                {drawings} />}
        </section>
    );
}
