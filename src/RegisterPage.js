import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const userExists = users.some(
            (u) => u.email === form.email || u.username === form.username
        );
        if (userExists) {
            setError('Пользователь с таким email или именем уже существует');
            return;
        }

        const newUser = { ...form };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        navigate('/login');
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4 text-center">Регистрация</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                <div className="mb-3">
                    <label className="form-label">Имя пользователя</label>
                    <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
