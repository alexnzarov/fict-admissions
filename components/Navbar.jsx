import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="navbar has-shadow" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbar">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar" className="navbar-menu">
        <div className="navbar-start" style={{ margin: 'auto' }}>
          <a className="navbar-item" onClick={() => router.push('/')}>
            Документи
          </a>

          <a className="navbar-item" onClick={() => router.push('/users')}>
            Користувачі
          </a>

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" onClick={() => router.push('/queues')}>
              Черги
            </a>

            <div className="navbar-dropdown">
              <a className="navbar-item" onClick={() => router.push('/queues/create')}>
                Створити чергу
              </a>
              <a className="navbar-item" onClick={() => router.push('/queues/users')}>
                Додати користувача
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;