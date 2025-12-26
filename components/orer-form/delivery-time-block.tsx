import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";

type DeliveryOption = {
  id: string;
  label: string;
  value: string;
  price: string;
};

const DeliveryTimeBlock = () => {
  const { flyerFormStore } = useStore();

  const deliveryOptions: DeliveryOption[] = [
    { id: "delivery1", label: "1 Hour", value: "1hour", price: "$20" },
    { id: "delivery5", label: "5 Hours", value: "5hours", price: "$10" },
    { id: "delivery24", label: "24 Hours", value: "24hours", price: "FREE" },
  ];

  const selectedDelivery = flyerFormStore.flyerFormDetail.deliveryTime;

  const handleChange = (value: string) => {
    flyerFormStore.updateDeliveryTime(value);
  };

  return (
    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold">Delivery Time *</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {deliveryOptions.map((opt) => (
          <div
            key={opt.id}
            className="flex items-center bg-gray-950 justify-between p-2 rounded-lg border border-gray-800
            hover:!ring-0 hover:!outline-none hover:!border-primary
            hover:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
            transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                id={opt.id}
                checked={selectedDelivery === opt.value}
                onCheckedChange={(checked) => checked && handleChange(opt.value)}
                className="border border-primary rounded-sm w-4 h-4"
              />
              <Label htmlFor={opt.id} className="text-white text-sm cursor-pointer font-medium">
                {opt.label}
              </Label>
            </div>
            <span className="text-primary text-sm font-bold flex items-center gap-1">
              {opt.price !== "FREE" && <Plus className="h-4 w-4 text-primary" />}
              {opt.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(DeliveryTimeBlock);
