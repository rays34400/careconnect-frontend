import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/authService";
import {
  PROFESSIONS,
  getSpecialtiesByProfession,
} from "@/constants/medicalFields";

export function RegisterForm() {
  const navigate = useNavigate();

  const [role, setRole] = useState<"patient" | "professional">("patient");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nomDeRue, setNomDeRue] = useState("");
  const [numeroAdresse, setNumeroAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [province, setProvince] = useState("");
  const [pays, setPays] = useState("");
  const [dateDeNaissance, setDateDeNaissance] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profession, setProfession] = useState("");
  const [specialty, setSpecialty] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableSpecialties = useMemo(() => {
    if (!profession) return [];
    return [...getSpecialtiesByProfession(profession as any)];
  }, [profession]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        email,
        password,
        role,
        nom,
        prenom,
        telephone,
        nomDeRue,
        numeroAdresse: Number(numeroAdresse),
        codePostal,
        province,
        pays,
        dateDeNaissance,
        ...(role === "professional" && {
          profession,
          specialties: specialty ? [specialty] : [],
        }),
      };

      const data = await registerUser(payload);

      setSuccess(
        data?.message || "Compte créé avec succès. Vérifie ton email."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Impossible de créer le compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Inscription</h1>
            <p className="text-sm text-slate-500">
              Créez votre compte CareConnect
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Rôle</Label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "patient" | "professional")
              }
              className="h-10 rounded-md border px-3"
            >
              <option value="patient">Patient</option>
              <option value="professional">Professionnel</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Nom</Label>
              <Input value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label>Prénom</Label>
              <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Téléphone</Label>
            <Input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Numéro adresse</Label>
              <Input
                type="number"
                value={numeroAdresse}
                onChange={(e) => setNumeroAdresse(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Nom de rue</Label>
              <Input
                value={nomDeRue}
                onChange={(e) => setNomDeRue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label>Code postal</Label>
              <Input
                value={codePostal}
                onChange={(e) => setCodePostal(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Province</Label>
              <Input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Pays</Label>
              <Input
                value={pays}
                onChange={(e) => setPays(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Date de naissance</Label>
            <Input
              type="date"
              value={dateDeNaissance}
              onChange={(e) => setDateDeNaissance(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Mot de passe</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {role === "professional" && (
            <>
              <div className="grid gap-2">
                <Label>Profession</Label>
                <select
                  value={profession}
                  onChange={(e) => {
                    setProfession(e.target.value);
                    setSpecialty("");
                  }}
                  className="h-10 rounded-md border px-3"
                  required
                >
                  <option value="">Choisir une profession</option>
                  {PROFESSIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label>Spécialité</Label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="h-10 rounded-md border px-3"
                  disabled={!profession}
                  required
                >
                  <option value="">Choisir une spécialité</option>
                  {availableSpecialties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inscription...
              </>
            ) : (
              "Créer un compte"
            )}
          </Button>

          <p className="text-center text-sm text-slate-600">
            Déjà un compte ?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}