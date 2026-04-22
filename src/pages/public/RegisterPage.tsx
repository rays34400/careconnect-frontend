import Navbar from "@/components/components Principal/layout/Navbar";
import { RegisterForm } from "@/components/components Principal/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}