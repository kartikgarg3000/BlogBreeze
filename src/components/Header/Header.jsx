import React, { useState, useEffect } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-2 bg-white shadow-lg' : 'py-4 bg-transparent'
    }`}>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='transform hover:scale-105 transition-transform duration-300'>
            <Link to='/' className='inline-block text-2xl font-bold text-primary-600'>
              Blog<span className="text-gray-900">Breeze</span>
            </Link>
          </div>
          <ul className='flex items-center space-x-2'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name} className="animate-fade-in">
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300
                      ${location.pathname === item.slug
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                      }
                      ${isScrolled ? 'hover:shadow-md' : 'hover:bg-white/20'}
                    `}
                  >
                    {item.name}
                    {location.pathname === item.slug && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
                    )}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className="animate-fade-in ml-2">
                <LogoutBtn className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300
                  ${isScrolled 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-white/10 text-red-500 hover:bg-white/20'
                  }`} 
                />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;