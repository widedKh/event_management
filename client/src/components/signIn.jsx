import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = (props) => {
    const navigate = useNavigate();

    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState([]); 

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/login", input, { withCredentials: true });
            console.log(response);

            if (response.data) {
                const userData = response.data;
                console.log('Token:', userData.token);
                localStorage.setItem("userToken", JSON.stringify(userData.token));
                localStorage.setItem("user._id", JSON.stringify(userData.user._id));
                localStorage.setItem("name", JSON.stringify(userData.name));

                navigate("/events");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                // If the error message is present, display it
                setErrors([err.response.data.msg]);
            } else {
                // If no specific error message, use a generic error
                setErrors(["An error occurred. Please try again."]);
            }
           
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h3 className="card-title text-primary">Login</h3>
                            <form onSubmit={handleLogin} className="form-group">
                                {errors && (
                                    <p style={{ color: "red" }}>
                                        {errors.map((err, key) => (
                                            <span key={key}>{err}</span>
                                        ))}
                                    </p>
                                )}
                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        name="email"
                                        value={input.email}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                        type="email"
                                        className="form-control"
                                    />
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
                                </div>

                                <button type="submit" className="btn btn-success">Login</button>
                                <p>Already have an account? </p>
                                <Link to="/Register">Sign up</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
