// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className='header'>Next.js & PostgreSQL App Demo</h1>
      <h3 className='header'>data encryption & verificaton</h3>
      <nav>

            <Link href="/login"><button>Login</button></Link>

            <Link href="/register"><button>Register</button></Link>

      </nav>
      <div>
      </div>
    </div>
  );
}
