import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProfessionalCardProps = {
  _id: string;
  nom: string;
  prenom: string;
  profession: string;
  specialties?: string[];
};

export default function ProfessionalCard({
  _id,
  nom,
  prenom,
  profession,
  specialties = [],
}: ProfessionalCardProps) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-bold text-slate-900">
          {prenom} {nom}
        </CardTitle>

        <p className="text-sm font-medium text-violet-600">{profession}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {specialties.length > 0 ? (
            specialties.map((specialty) => (
              <Badge
                key={specialty}
                variant="secondary"
                className="rounded-xl bg-slate-100 text-slate-700"
              >
                {specialty}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-slate-400">Aucune spécialité affichée</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          className="w-full rounded-xl bg-violet-600 hover:bg-violet-700"
          asChild
        >
          <Link to={`/professionals/${_id}?book=1`}>
            Prendre rendez-vous
          </Link>
        </Button>

        <Button variant="outline" className="w-full rounded-xl" asChild>
          <Link to={`/professionals/${_id}`}>Voir profil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}