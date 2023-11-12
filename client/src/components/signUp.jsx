import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = (props) => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/register", input, { withCredentials: true });
            console.log(response);
            localStorage.setItem("userToken", input);
            navigate("/events");
        } catch (err) {
            console.log(err.response.data); // Log the entire response to the console
            const errorRes = err.response.data.error.errors;
            const errArr = [];

            for (const key of Object.keys(errorRes)) {
                console.log(errorRes[key].message);
                errArr.push({ field: key, message: errorRes[key].message });
            }
            setErrors(errArr);
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h3 className="card-title text-primary">Register</h3>
                            <form onSubmit={handleSubmit} className="form-group">

                                <div className="mb-3">
                                    <label className="form-label">First name</label>
                                    <input
                                        name="firstName"
                                        value={input.firstName}
                                        type="text"
                                        className="form-control"
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                    />
                                    {errors.map((error) => error.field === 'firstName' && (
                                        <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Last name</label>
                                    <input
                                        name="lastName"
                                        value={input.lastName}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                        type="text"
                                        className="form-control"
                                    />
                                    {errors.map((error) => error.field === 'lastName' && (
                                        <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        name="email"
                                        value={input.email}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                        type="email"
                                        className="form-control"
                                    />
                                    {errors.map((error) => error.field === 'email' && (
                                        <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        name="password"
                                        value={input.password}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                        type="password"
                                        className="form-control"
                                    />
                                    {errors.map((error) => error.field === 'password' && (
                                        <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirm password</label>
                                    <input
                                        name="confirmPassword"
                                        value={input.confirmPassword}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                        type="password"
                                        className="form-control"
                                    />
                                    {errors.map((error) => error.field === 'confirmPassword' && (
                                        <p key={error.field} style={{ color: 'red' }}>{error.message}</p>
                                    ))}
                                </div>

                                <button type="submit" className="btn btn-success">Register</button>
                                <p>Already have an account? </p>
                                <Link to="/login">Login</Link>
                            </form>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
