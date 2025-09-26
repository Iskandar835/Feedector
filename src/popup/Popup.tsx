import { useState } from "react";
import Button from "@/components/ui/Button";
import SelectField from "@/components/SelectField";

export default function Popup() {
  const [filters, setFilters] = useState({
    minFollowers: "0",
    timeRange: "0",
    minReactions: "0",
  });

  const handleValueChange = (name: string) => (value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  function sendMessageToContent<T = any>(
    action: string,
    payload: any
  ): Promise<T> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action, payload },
            (response) => {
              resolve(response as T);
            }
          );
        }
      });
    });
  }

  async function handleApplyFilters() {
    const allValid = Object.values(filters).every((value) => value !== "0");
    if (!allValid) {
      return;
    }
    try {
      const response = await sendMessageToContent("APPLY_FILTERS", filters);
      return response;
    } catch (error) {
      console.error("Erreur lors de l'envoi des filtres :", error);
    }
  }

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
          <form>
            <div className="mb-4">
              <p className="text-[var(--Txt-color)] font-medium text-base mb-2">
                Nombre minimum d'abonnées des profils
              </p>
              <SelectField
                selectName="minFollowers"
                required={true}
                onValueChange={handleValueChange("minFollowers")}
                options={[
                  { value: "500", label: "jusqu'à 500" },
                  { value: "2500", label: "jusqu'à 2500" },
                  { value: "5000", label: "jusqu'à 5000" },
                  { value: "10000", label: "jusqu'à 10000" },
                  { value: "10001", label: "à partir de 10000 et plus" },
                ]}
              />
            </div>
            <div className="mb-4">
              <p className="text-[var(--Txt-color)] font-medium text-base mb-2">
                Nombre minimum de réactions sur les posts
              </p>
              <SelectField
                selectName="minReactions"
                required={true}
                onValueChange={handleValueChange("minReactions")}
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
                selectName="timeRange"
                required={true}
                onValueChange={handleValueChange("timeRange")}
                options={[
                  { value: "24", label: "24 heures" },
                  { value: "48", label: "48 heures" },
                  { value: "1", label: "1 semaine" },
                ]}
              />
            </div>
            <div className="flex justify-center mt-12">
              <Button content="Valider" onClick={handleApplyFilters} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
