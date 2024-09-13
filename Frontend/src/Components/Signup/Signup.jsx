import React, { useContext, useEffect, useState } from "react";
import "./Signup.css";
import { signinUser, signupUser } from "../../utils/apis";
import UserContext from "../../context";
import { Navigate, useNavigate } from "react-router-dom";

const Signup = () => {
  const ctx = useContext(UserContext);
  let navigate = useNavigate();
  const [isLoginNowClicked, setIsLoginNowClicked] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const handleLoginNowClicked = () => {
    setIsLoginNowClicked(true);
    setEmail("");
    setPassword("");
    setName("");
  };
  const handleSignUpNowClicked = () => {
    setIsLoginNowClicked(false);
    setEmail("");
    setPassword("");
  };
  useEffect(() => {
    if (ctx.isLoggedIn) {
      navigate("/protected/chat");
    }
  }, [ctx]);
  const handleSignupClicked = async () => {
    if (
      email === "" ||
      password === "" ||
      name === "" ||
      !email.includes("@")
    ) {
      alert("Please fill all the fields and enter a valid email");
      return;
    }
    try {
      let res = await signupUser(email, name, password);
      if (res?.status === "success") {
        ctx.onLogin({
          id: res?.user?._id,
          name: res?.user?.name,
          email: res?.user?.email,
          token: res?.token,
        });
        navigate("/protected/chat");
      } else if (res?.status === "error") {
        alert(res?.message);
      }
    } catch (error) {}
  };
  const handleSiginClicked = async (e) => {
    if (email === "" || password === "" || !email.includes("@")) {
      alert("Please fill all the fields and enter a valid email");
      return;
    }
    try {
      let res = await signinUser(email, password);
      if (res?.status === "success") {
        ctx.onLogin({
          id: res?.user?._id,
          name: res?.user?.name,
          email: res?.user?.email,
          token: res?.token,
        });
        navigate("/protected/chat");
      } else if (res?.status === "error") {
        alert(res?.message);
      }
    } catch (error) {}
  };

  return (
   <>
   {!ctx.isLoggedIn &&  <div className="container">
      <input type="checkbox" id="flip" />
      <div className="cover">
        <div className="front">
          <img
            src="https://media.istockphoto.com/id/1371726643/photo/different-notifications-on-violet-background-pop-up-messages-copy-space.webp?b=1&s=170667a&w=0&k=20&c=FhmBYUrsGsR0hYn5zEDa0SkEFfF-rwuUfMEZ4HpX0rE="
            alt=""
          />
          <div className="text">
            <span className="text-1">
              Every new friend is a <br /> new adventure
            </span>
            <span className="text-2">Let's get connected</span>
          </div>
        </div>
      </div>
      <div className="forms">
        <div className="form-content">
          <div className="login-form">
            <div className="title">Login</div>
            <div>
              <div className="input-boxes">
                <div className="input-box">
                  <i className="fas fa-envelope"></i>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="button input-box">
                  <input
                    onClick={handleSiginClicked}
                    type="submit"
                    value="Submit"
                  />
                </div>
                <div className="text sign-up-text">
                  Don't have an account?{" "}
                  <label onClick={handleSignUpNowClicked} htmlFor="flip">
                    Signup now
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="signup-form">
            <div className="title">Signup</div>
            <div>
              <div className="input-boxes">
                <div className="input-box">
                  <i className="fas fa-user"></i>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-envelope"></i>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="button input-box">
                  <input
                    onClick={handleSignupClicked}
                    type="submit"
                    value="Submit"
                  />
                </div>
                <div className="text sign-up-text">
                  Already have an account?{" "}
                  <label onClick={handleLoginNowClicked} htmlFor="flip">
                    Login now
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>}
   </>
  );
};

export default Signup;
