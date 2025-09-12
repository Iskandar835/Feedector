import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import Toast from "@/components/Toast";
import { useEffect, useState } from "react";

export default function Popup() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div
        className={`fixed top-6 right-[185px] transform transition-all duration-500 ease-out z-10 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"
        }`}
      >
        <Toast variant="success" />
      </div>
      <div
        className={`fixed top-[500px] right-[125px] -translate-y-1/2 transform transition-all duration-500 ease-out max-w-md mx-auto overflow-hidden z-10 bg-white p-8 rounded-lg shadow-md before:w-45 before:h-45 before:absolute before:bg-[var(--secondary-color)] before:rounded-full before:-z-10 before:blur-3xl after:w-55 after:h-55 after:absolute after:bg-[var(--main-color)] after:rounded-full after:-z-10 after:blur-3xl after:top-24 after:-right-12 ${
          mounted
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-[calc(100%+100px)]"
        }`}
      >
        <h1 className="text-[var(--main-color)] font-title text-center text-2xl font-bold mb-4">
          Parametrez votre Feed !
        </h1>
        <p className="text-[var(--Txt-color)] font-text font-medium text-center mb-6">
          Ces parametres seront appliques sur votre fil d'actualités afin
          d'eviter de scroller inutilement !
        </p>
        <h2 className="font-bold text-xl font-title  mb-2 text-[var(--main-color)]">
          Filtres :
        </h2>
        <form action="#">
          <div className="mb-4">
            <p className="text-[var(--Txt-color)] font-medium mb-1">
              Nombre minimum d'abonnées des profils
            </p>
            <SelectField
              options={[
                { value: "500/2500", label: "500 - 2500" },
                { value: "2500/5000", label: "2500 - 5000" },
                { value: "5000/10000", label: "5000 - 10000" },
                { value: "+10000", label: "+ 10000" },
              ]}
            />
          </div>
          <div className="mb-4">
            <p className="text-[var(--Txt-color)] font-medium mb-1">
              Photo de profil obligatoire sur les profils
            </p>
            <SelectField
              options={[
                { value: "true", label: "Oui" },
                { value: "false", label: "Non" },
              ]}
            />
          </div>
          <div className="mb-4">
            <p className="text-[var(--Txt-color)] font-medium mb-1">
              Afficher uniquement les posts sur les dernières
            </p>
            <SelectField
              options={[
                { value: "24", label: "24 heures" },
                { value: "48", label: "48 heures" },
                { value: "1", label: "1 semaine" },
              ]}
            />
          </div>
          <div className="flex justify-center mt-10">
            <Button content="Valider" onClick={() => {}} />
          </div>
        </form>
      </div>
    </>
  );
}
