import { NavLink } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/" end>Red</NavLink>
        </li>
        <li>
          <NavLink to="/cabin">Cabina</NavLink>
        </li>
        <li>
          <NavLink to="/system">Sistema</NavLink>
        </li>
      </ul>
    </nav>
  );
}