import { useEffect, useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";

type ExtrasBlockProps = {};

const ExtrasBlock = (props: ExtrasBlockProps) => {
  const { flyerFormStore } = useStore();

  const extrasList = [
    { id: "story", label: "Story Size Version", price: 10, key: "storySizeVersion" },
    { id: "custom", label: "Make Flyer Different/Custom", price: 10, key: "customFlyer" },
    { id: "animated", label: "Animated Flyer", price: 25, key: "animatedFlyer" },
    { id: "insta", label: "Instagram Post Size", price: 0, key: "instagramPostSize" },
  ];

  // Load initial state from MobX store
  const [selectedExtras, setSelectedExtras] = useState<string[]>(() => {
    const extras = flyerFormStore.flyerFormDetail.extras;
    return extrasList
      .filter((extra) => extras[extra.key as keyof typeof extras])
      .map((extra) => extra.id);
  });

  // Handle checkbox toggle
  const handleCheckboxChange = (id: string, checked: boolean, key: keyof typeof flyerFormStore.flyerFormDetail.extras) => {
    flyerFormStore.toggleExtra(key); // Update MobX store

    setSelectedExtras((prev) => {
      if (checked) return [...prev, id];
      return prev.filter((item) => item !== id);
    });
  };

  // Keep selectedExtras in sync with store if store changes externally
  useEffect(() => {
    const extras = flyerFormStore.flyerFormDetail.extras;
    setSelectedExtras(
      extrasList
        .filter((extra) => extras[extra.key as keyof typeof extras])
        .map((extra) => extra.id)
    );
  }, [flyerFormStore.flyerFormDetail.extras]);

  return (
    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Extras</h2>
        <Plus className="h-4 w-4 text-primary animate-pulse" />
      </div>

      {/* Extras List */}
      <div className="space-y-3">
        {extrasList.map((extra) => (
          <div
            key={extra.id}
            className="flex bg-gray-950 items-center justify-between p-2 rounded-lg border border-gray-800 hover:!ring-0 hover:!outline-none hover:!border-primary hover:!shadow-[0_0_15px_rgba(185,32,37,0.8)] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                id={extra.id}
                checked={selectedExtras.includes(extra.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(extra.id, !!checked, extra.key as keyof typeof flyerFormStore.flyerFormDetail.extras)
                }
                className="border border-primary rounded-sm w-4 h-4"
              />
              <Label
                htmlFor={extra.id}
                className="text-white text-sm cursor-pointer font-medium"
              >
                {extra.label}
              </Label>
            </div>
            <span className="text-primary text-sm font-bold flex gap-1 items-center">
              {extra.price > 0 && <Plus className="h-4 w-4 text-primary" />}
              {extra.price === 0 ? "FREE" : `$${extra.price}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(ExtrasBlock);
