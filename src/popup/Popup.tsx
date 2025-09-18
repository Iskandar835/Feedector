import Button from "@/components/ui/Button";
import SelectField from "@/components/SelectField";

export default function Popup() {
  return (
    <>
      <div
        className={
          "relative max-w-md w-[450px] max-h-[600px] mx-auto overflow-hidden z-10 bg-white p-8 before:w-45 before:h-45 before:absolute before:bg-[var(--secondary-color)] before:rounded-full before:-z-10 before:blur-3xl after:w-55 after:h-55 after:absolute after:bg-[var(--main-color)] after:rounded-full after:-z-10 after:blur-3xl after:top-24 after:-right-12"
        }
      >
        <div>
          <h1 className="text-[var(--main-color)] font-title text-center text-2xl font-bold mb-3">
            Parametrez votre Feed !
          </h1>
          <p className="text-[var(--Txt-color)] text-base font-text font-medium text-center mb-8">
            Ces parametres seront appliques sur votre fil d'actualités afin
            d'eviter de scroller inutilement !
          </p>
          <h2 className="font-bold text-xl font-title  mb-3 text-[var(--main-color)]">
            Filtres :
          </h2>
          <form action="#">
            <div className="mb-4">
              <p className="text-[var(--Txt-color)] font-medium text-base mb-2">
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
              <p className="text-[var(--Txt-color)] font-medium text-base mb-2">
                Nombre minimum de réactions sur les posts
              </p>
              <SelectField
                options={[
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                  { value: "500", label: "500" },
                ]}
              />
            </div>
            <div className="mb-4">
              <p className="text-[var(--Txt-color)] font-medium text-base mb-2">
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
            <div className="flex justify-center mt-12">
              <Button content="Valider" onClick={() => {}} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
