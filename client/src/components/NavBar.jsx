import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <header className='navbar'>
            <span className='brand'>Atelier sous-marin</span>
            <nav>
                <NavLink to='/' end>Dessiner</NavLink>
                <NavLink to='/aquarium'>Aquarium</NavLink>
            </nav>
        </header>
    );
}
