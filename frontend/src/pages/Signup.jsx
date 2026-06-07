import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:"",
    email:"",
    password:""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/auth/signup",
        form
      );

      alert("Signup Successful");

      navigate("/");

    }

    catch(error){

      alert(
        error.response?.data?.message ||
        "Signup Failed"
      );

    }

  };

  return (

    <div style={{
      display:"flex",
      flexDirection:"column",
      width:"300px",
      margin:"100px auto"
    }}>

      <h2>Signup</h2>

      <input
      name="name"
      placeholder="Name"
      onChange={handleChange}
      />

      <input
      name="email"
      placeholder="Email"
      onChange={handleChange}
      />

      <input
      type="password"
      name="password"
      placeholder="Password"
      onChange={handleChange}
      />

      <button
      onClick={handleSubmit}
      >
      Signup
      </button>

    </div>

  );

}

export default Signup;