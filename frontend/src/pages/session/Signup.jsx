import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [signUpErrors, setSignUpErrors] = useState({});
  const navigate = useNavigate();

  const validateSignUp = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = "名前は空にできません";
    }

    if (!email.trim()) {
      errors.email = "メールアドレスは空にできません";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "メールアドレスの形式が正しくありません";
    }

    if (!password) {
      errors.password = "パスワードは空にできません";
    } else if (password.length < 8) {
      errors.password = "パスワードは8文字以上でなければなりません";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "パスワードの確認をしてください";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "確認用パスワードが一致しません";
    }

    if (!role) {
      errors.role = "役割を選択してください";
    }

    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateSignUp()) {
      return;
    }

    try {
      const response = await fetch("https://your-api-endpoint.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSignUpErrors({
          apiError: errorData.message || "サインアップに失敗しました",
        });
        return;
      }

      const data = await response.json();
      console.log("サインアップ成功:", data);

      navigate("/login");
    } catch (error) {
      console.error("サインアップエラー:", error);
      setSignUpErrors({
        apiError: "エラーが発生しました。後で再試行してください。",
      });
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
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">KANTAN LUNCH へようこそ</h4>
                    <p className="small mb-0">
                      当チームからの特典や最新情報を楽しむためにアカウントを作成してください。
                    </p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <h4 className="mb-4">新しいアカウントを作成する</h4>

                    <form onSubmit={handleSignup}>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="username"
                          className="form-control"
                          placeholder="名前"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        {signUpErrors.username && (
                          <small className="text-danger">
                            {signUpErrors.username}
                          </small>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="メールアドレス"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {signUpErrors.email && (
                          <small className="text-danger">
                            {signUpErrors.email}
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
                        {signUpErrors.password && (
                          <small className="text-danger">
                            {signUpErrors.password}
                          </small>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="confirmPassword"
                          className="form-control"
                          placeholder="確認用パスワード"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {signUpErrors.confirmPassword && (
                          <small className="text-danger">
                            {signUpErrors.confirmPassword}
                          </small>
                        )}
                      </div>

                      <div className="form-check form-check-inline mb-4">
                        <input
                          className="form-check-input rounded"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          checked={role === "vietnamese_teacher"}
                          onChange={() => setRole("vietnamese_teacher")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault1"
                        >
                          ベトナムの教師
                        </label>
                      </div>

                      <div className="form-check form-check-inline mb-4">
                        <input
                          className="form-check-input rounded"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          checked={role === "japanese_teacher"}
                          onChange={() => setRole("japanese_teacher")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault2"
                        >
                          日本の教師
                        </label>
                      </div>
                      {signUpErrors.role && (
                        <div style={{ marginTop: "0", marginBottom: "5px" }}>
                          <small className="text-danger">
                            {signUpErrors.role}
                          </small>
                        </div>
                      )}

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          type="submit"
                          className="btn btn-success btn-block gradient-custom-2 mb-3"
                        >
                          サインアップ
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">
                          すでにアカウントをお持ちですか？
                        </p>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => navigate("/login")}
                        >
                          ログイン
                        </button>
                      </div>
                    </form>
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

export default Signup;
