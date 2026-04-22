import LoginForm from "@/components/components Principal/auth/LoginForm";
import Navbar from "@/components/components Principal/layout/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Connexion</h1>
          <p className="mt-2 text-slate-600">
            Connectez-vous pour accéder à votre espace.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}