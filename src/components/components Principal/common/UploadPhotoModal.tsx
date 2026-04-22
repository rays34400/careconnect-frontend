import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateMyPhoto } from "@/services/userService";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export default function UploadPhotoModal({
  open,
  onClose,
  onUpdated,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setError("");

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (!file) {
        setError("Veuillez choisir une image.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Utilisateur non connecté.");
        return;
      }

      setLoading(true);

      await updateMyPhoto(file, token);

      onUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Impossible de mettre à jour la photo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Modifier la photo
          </DialogTitle>
          <p className="text-sm text-slate-500">
            Formats acceptés : JPG, PNG, WEBP. Taille max : 3MB.
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            onClick={handleOpenFilePicker}
            className="w-full rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Choisir une image
          </Button>

          {file && (
            <p className="text-sm text-slate-600">
              Fichier sélectionné : {file.name}
            </p>
          )}

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="h-32 w-32 rounded-xl border object-cover"
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Annuler
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-violet-600 hover:bg-violet-700"
          >
            {loading ? "Envoi..." : "Mettre à jour"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}