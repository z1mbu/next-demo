import { useUser } from '../context/UserContext';

export default function Navbar() {
    const { user, logout } = useUser();

    return (
        <nav>
            {user ? (
                <>
                    <span>Welcome, {user.username}!</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <a href="/login">Login</a>
            )}
        </nav>
    );
}
