import { useState } from "react";
import Button from "@/components/ui/Button";
import SelectField from "@/components/SelectField";

export default function Popup() {
  const [filters, setFilters] = useState({
    timeRange: "0",
    minReactions: "0",
  });

  let succesResponse = false;

  const handleValueChange = (name: string) => (value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  function sendMessageToContent<T = any>(
    action: string,
    payload?: any
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
    try {
      const response = await sendMessageToContent("APPLY_FILTERS", filters);
      return response;
    } catch (error) {
      console.error("Error sending filters :", error);
      alert("Error sending filters, please try again later");
    }
  }

  async function handleResetFilters() {
    try {
      const response = await sendMessageToContent("RESET_FILTERS");
      return response;
    } catch (error) {
      console.error("Error resetting filters :", error);
      alert("Error to reset filters, please try again later");
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
                Nombre minimum de réactions sur les posts
              </p>
              <SelectField
                selectName="minReactions"
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
                onValueChange={handleValueChange("timeRange")}
                options={[
                  { value: "24", label: "24 heures" },
                  { value: "48", label: "48 heures" },
                  { value: "1", label: "1 semaine" },
                ]}
              />
            </div>
            <div className="mt-6">
              <button
                onClick={handleResetFilters}
                className="text-[var(--Txt-color)] font-medium text-base mb-2 underline cursor-pointer  hover:text-[var(--main-color)]"
              >
                Réinitialiser les filtres
              </button>
            </div>
            <div className="flex justify-center mt-7">
              <Button content="Valider" onClick={handleApplyFilters} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
