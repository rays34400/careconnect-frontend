import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/services/userService";
import { PROFESSIONS, getSpecialtiesByProfession } from "@/constants/medicalFields";

type Props = {
  open: boolean;
  onClose: () => void;
  user: any;
  onUpdated: () => void;
};

export default function EditProfileModal({
  open,
  onClose,
  user,
  onUpdated,
}: Props) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    nomDeRue: "",
    numeroAdresse: "",
    codePostal: "",
    province: "",
    pays: "",
    profession: "",
    specialties: [] as string[],
    sessionDuration: "",
    bookingMode: "auto",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nom: user.nom || "",
        prenom: user.prenom || "",
        telephone: user.telephone || "",
        nomDeRue: user.nomDeRue || "",
        numeroAdresse: user.numeroAdresse?.toString() || "",
        codePostal: user.codePostal || "",
        province: user.province || "",
        pays: user.pays || "",
        profession: user.profession || "",
        specialties: user.specialties || [],
        sessionDuration: user.sessionDuration?.toString() || "",
        bookingMode: user.bookingMode || "auto",
      });
    }
  }, [user]);

  const availableSpecialties = useMemo(() => {
    if (!form.profession) return [];
    return [...getSpecialtiesByProfession(form.profession as any)];
  }, [form.profession]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      specialties: value ? [value] : [],
    }));
  };

  const handleProfessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      profession: value,
      specialties: [],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      const payload: any = {
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone,
        nomDeRue: form.nomDeRue,
        numeroAdresse: Number(form.numeroAdresse),
        codePostal: form.codePostal,
        province: form.province,
        pays: form.pays,
      };

      if (user.role === "professional") {
        payload.profession = form.profession;
        payload.specialties = form.specialties;
        payload.sessionDuration = Number(form.sessionDuration);
        payload.bookingMode = form.bookingMode;
      }

      await updateProfile(payload, token);

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Modifier mon profil
          </DialogTitle>
          <p className="text-sm text-slate-500">
            Mettez à jour vos informations.
          </p>
        </DialogHeader>

        <div className="mt-6 grid gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nom</label>
              <Input name="nom" value={form.nom} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Prénom</label>
              <Input name="prenom" value={form.prenom} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Téléphone</label>
            <Input name="telephone" value={form.telephone} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Numéro</label>
              <Input
                name="numeroAdresse"
                type="number"
                value={form.numeroAdresse}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Rue</label>
              <Input name="nomDeRue" value={form.nomDeRue} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Code postal</label>
              <Input name="codePostal" value={form.codePostal} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Province</label>
              <Input name="province" value={form.province} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Pays</label>
              <Input name="pays" value={form.pays} onChange={handleChange} />
            </div>
          </div>

          {user.role === "professional" && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Profession</label>
                  <select
                    name="profession"
                    value={form.profession}
                    onChange={handleProfessionChange}
                    className="h-10 w-full rounded-md border px-3"
                  >
                    <option value="">Choisir une profession</option>
                    {PROFESSIONS.map((profession) => (
                      <option key={profession} value={profession}>
                        {profession}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Spécialité</label>
                  <select
                    value={form.specialties[0] || ""}
                    onChange={handleSpecialtyChange}
                    className="h-10 w-full rounded-md border px-3"
                    disabled={!form.profession}
                  >
                    <option value="">Choisir une spécialité</option>
                    {availableSpecialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Durée de séance (minutes)
                  </label>
                  <Input
                    name="sessionDuration"
                    type="number"
                    value={form.sessionDuration}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Mode de réservation
                  </label>
                  <select
                    name="bookingMode"
                    value={form.bookingMode}
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border px-3"
                  >
                    <option value="auto">Auto</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}