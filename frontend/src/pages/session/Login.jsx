import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = "ユーザー名は空にできません";
    }

    if (!password) {
      errors.password = "パスワードは空にできません";
    } else if (password.length < 8) {
      errors.password = "パスワードは8文字以上でなければなりません";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await fetch("https://your-api-endpoint.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ apiError: errorData.message || "ログインに失敗しました" });
        return;
      }

      const data = await response.json();
      console.log("ログイン成功:", data);

      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
      } else {
        sessionStorage.setItem("authToken", data.token);
      }

      navigate("/");
    } catch (error) {
      console.error("ログインエラー:", error);
      setErrors({ apiError: "エラーが発生しました。後で再試行してください。" });
    }
  };

  return (
    <section
      className="h-100 gradient-form"
      style={{ backgroundColor: "#eee" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        alt="logo"
                        style={{ width: "185px" }}
                      />
                      <h4 className="mt-1 mb-5 pb-1">私たちは KANTAN LUNCH です</h4>
                    </div>

                    <form onSubmit={handleLogin}>
                      <p>アカウントにログインしてください</p>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="username"
                          className="form-control"
                          placeholder="ユーザーネーム"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.username && (
                          <small className="text-danger">
                            {errors.username}
                          </small>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          placeholder="パスワード"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                          <small className="text-danger">
                            {errors.password}
                          </small>
                        )}
                      </div>

                      <div className="d-flex align-items-center mb-4">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          アカウントを記憶する
                        </label>
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block gradient-custom-2 mb-3"
                        >
                          ログイン
                        </button>
                      </div>

                      <div className="text-center mb-4">
                        <a className="text-muted" href="#!">
                          パスワードをお忘れですか？
                        </a>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">アカウントをお持ちでない場合：</p>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => navigate("/signup")}
                        >
                          サインアップ
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">私たちは単なる会社ではありません</h4>
                    <p className="small mb-0">
                      私たちは、コンセプトやアイデアを追求し、新しいソリューションを提供します。より良い未来のために取り組んでいます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
