import React, { useState } from 'react';
import { urlConfig } from '../../config';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('auth-token');

    const handleLogin = async () => {
        try {
            const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const json = await res.json();

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                navigate('/app');
            } else {
                setIncorrect('Wrong email or password');
            }
        } catch (e) {
            setIncorrect(e.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Login</h2>
                    <input className="form-control mb-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="form-control mb-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="text-danger mb-2">{incorrect}</div>
                    <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
