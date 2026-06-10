import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h1>

        <LoginForm />
      </div>
    </div>
  );
}

export default Login;