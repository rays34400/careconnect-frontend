import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/components Principal/layout/Navbar";
import api from "@/services/api";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const hasCalled = useRef(false);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || hasCalled.current) return;
    hasCalled.current = true;

    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        setSuccess(true);
        setMessage(
          response.data?.message || "Email vérifié avec succès."
        );
      } catch (error: any) {
        setSuccess(false);
        setMessage(
          error?.response?.data?.message || "Lien invalide ou expiré."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm text-center">
          {loading ? (
            <>
              <h1 className="text-2xl font-bold text-slate-900">
                Vérification en cours...
              </h1>
              <p className="mt-3 text-slate-600">
                Nous vérifions votre adresse email.
              </p>
            </>
          ) : (
            <>
              <h1
                className={`text-2xl font-bold ${
                  success ? "text-green-600" : "text-red-500"
                }`}
              >
                {success
                  ? "Email vérifié avec succès"
                  : "Vérification impossible"}
              </h1>

              <p className="mt-4 text-slate-600">{message}</p>

              <div className="mt-8 flex justify-center gap-3">
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <Link to="/login">Aller à la connexion</Link>
                </Button>

                {!success && (
                  <Button asChild variant="outline">
                    <Link to="/register">Retour à l’inscription</Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}