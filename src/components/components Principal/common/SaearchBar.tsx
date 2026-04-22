import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SearchBar() {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-violet-600 hover:bg-violet-700">
            Rechercher
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[400px] sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>Rechercher un professionnel</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <Input placeholder="Nom, profession, spécialité..." className="h-12" />

            <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700">
              Lancer la recherche
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}