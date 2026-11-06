import React, { useState } from 'react';
import { urlConfig } from '../../config';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
            });

            const json = await response.json();

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                navigate('/app');
            }
            if (json.error) {
                setShowerr(json.error);
            }
        } catch (e) {
            setShowerr(e.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Register</h2>
                    <input className="form-control mb-3" type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input className="form-control mb-3" type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input className="form-control mb-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="form-control mb-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="text-danger mb-2">{showerr}</div>
                    <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
