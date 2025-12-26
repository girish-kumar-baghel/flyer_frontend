import React, { useState } from "react";
import { Music, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toJS } from "mobx";

const HostSection = observer(() => {
  const { flyerFormStore } = useStore();
  const hosts = flyerFormStore.flyerFormDetail.host || [{ name: "", image: null }];

  // For instant image preview (local) - array of previews
  const [hostPreviews, setHostPreviews] = useState<(string | null)[]>([null]);

  // -----------------------------
  // ✅ Handle host name change
  // -----------------------------
  const handleHostNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    flyerFormStore.updateHost(index, "name", e.target.value);
  };

  // -----------------------------
  // ✅ Handle host image upload
  // -----------------------------
  const handleFileUploadHost = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    flyerFormStore.updateHost(index, "image", file);

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      setHostPreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[index] = reader.result as string;
        return newPreviews;
      });
    };
    reader.readAsDataURL(file);
  };

  // -----------------------------
  // ✅ Remove image
  // -----------------------------
  const handleRemoveImage = (index: number) => {
    flyerFormStore.updateHost(index, "image", null);
    setHostPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
  };

  // -----------------------------
  // ✅ Add new host field
  // -----------------------------
  const handleAddHost = () => {
    if (hosts.length < 2) {
      flyerFormStore.addHost();
      setHostPreviews(prev => [...prev, null]);
    }
  };

  // -----------------------------
  // ✅ Remove host field
  // -----------------------------
  const handleRemoveHost = (index: number) => {
    if (hosts.length > 1) {
      flyerFormStore.removeHost(index);
      setHostPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  // -----------------------------
  // ✅ Render
  // -----------------------------
  return (
    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-bold">Host</h2>

      {hosts.map((host, index) => (
        <div key={index} className="space-y-2">
          <Label className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              Host {index + 1}
            </div>
            {hosts.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveHost(index)}
                className="text-primary text-xs hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </Label>

          {(flyerFormStore.flyer?.form_type === "With Photo" || flyerFormStore.flyer?.hasPhotos) ? (
            <div className="relative">
              <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg shadow-md hover:border-primary hover:shadow-[0_0_15px_rgba(185,32,37,0.8)] transition-all duration-300 pr-3">
                {/* Name input - takes full width */}
                <Input
                  value={host?.name || ""}
                  onChange={(e) => handleHostNameChange(e, index)}
                  placeholder="Enter host name..."
                  className="bg-transparent border-none text-white placeholder:text-gray-600 
                    focus-visible:ring-0 focus-visible:ring-offset-0 h-10 flex-1 pl-3 pointer-events-auto"
                />

                {/* Image preview on RIGHT (if uploaded) */}
                {(hostPreviews[index] || host?.image) && (
                  <>
                    <div className="flex-shrink-0">
                      <img
                        src={hostPreviews[index] || (host?.image ? URL.createObjectURL(host.image) : "")}
                        alt="Host"
                        className="w-8 h-8 rounded object-cover border border-primary"
                      />
                    </div>

                    {/* Remove image button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-primary text-xs hover:underline font-semibold flex-shrink-0"
                    >
                      Remove
                    </button>
                  </>
                )}

                {/* Upload button on RIGHT (only show if NO image) */}
                {!hostPreviews[index] && !host?.image && (
                  <label htmlFor={`host-upload-${index}`} className="cursor-pointer flex-shrink-0 pointer-events-auto">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 hover:bg-primary/20 transition-all">
                      <Upload className="w-4 h-4 text-primary" />
                    </div>
                    <input
                      id={`host-upload-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUploadHost(e, index)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ) : (
            <Input
              value={host?.name || ""}
              onChange={(e) => handleHostNameChange(e, index)}
              placeholder="Enter host name..."
              className="bg-gray-950 border border-gray-800 text-white
                placeholder:text-gray-600 rounded-lg h-10 shadow-md
                focus-visible:!ring-0 focus-visible:!outline-none
                focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
                transition-all duration-300"
            />
          )}
        </div>
      ))}

      {hosts.length < 2 && (
        <button
          type="button"
          onClick={handleAddHost}
          className="w-full py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all"
        >
          Add Host ({hosts.length}/2)
        </button>
      )}
    </div>
  );
});

export default HostSection;
