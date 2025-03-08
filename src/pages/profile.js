import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import VerifyButton from './VerifyButton';
import Navbar from './Navbar';


export async function getServerSideProps(context) {
    const { req } = context;
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
        return {
            redirect: { destination: '/login', permanent: false }
        };
    }

    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        return {
            props: { user: decoded }
        };
    } catch (error) {
        return {
            redirect: { destination: '/login', permanent: false }
        };
    }
}

export default function Profile({ user }) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [dataList, setDataList] = useState([]);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        if (!user) {
            setError('User not found. Please log in.');
            return;
        }

        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.userId, content })
        });

        const data = await res.json();
        if (res.ok) {
            setContent('');
            fetchData();
        } else {
            setError(data.error);
        }
    }


    async function fetchData() {
        const res = await fetch('/api/data');
        const data = await res.json();
        if (res.ok) {
            setDataList(data.data);
        }
    }

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    };

    useEffect(() => {
        if (user?.userId) {
            fetchData();
        }
    }, [user?.userId]);

    if (!user) {
        return <p>Loading user data...</p>;
    }

      
    return (
        <div id='content'>
                            <Navbar />

            <h1 className='header'>Profile Page</h1>
            <p>Welcome, {user.username} </p>
            <p>(ID: {user.userId}, UUID: {user.userUid})</p>
            <button onClick={handleLogout}>Logout</button>

            <h2 className='header'>Create Data</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter some data"
                />
                <br />
                <button type="submit">Sign</button>
            </form>

            <h2 className='header'>All Data</h2>
            <table>
                <tbody>
                    {dataList.map((item) => (
                        <tr key={item.id}>
                            <td>
                            {item.content}
                            <br></br>
                            <small>credit: {item.username}</small>
                            <br></br>
                            <div>

                <VerifyButton dataId={item.id} />

          </div>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
