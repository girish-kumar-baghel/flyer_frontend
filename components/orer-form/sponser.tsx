import { useRef, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";

const SponsorsBlock = observer(() => {
  const { flyerFormStore } = useStore();

  const sponsorRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Local state for previews and filenames
  const [sponsorImages, setSponsorImages] = useState<(string | null)[]>([null, null, null]);
  const [fileNames, setFileNames] = useState<(string | null)[]>([null, null, null]);

  // -----------------------------
  // ✅ Load initial images from store
  // -----------------------------
  useEffect(() => {
    const sponsors = flyerFormStore.flyerFormDetail.sponsors;
    setSponsorImages([
      sponsors.sponsor1 ? URL.createObjectURL(sponsors.sponsor1) : null,
      sponsors.sponsor2 ? URL.createObjectURL(sponsors.sponsor2) : null,
      sponsors.sponsor3 ? URL.createObjectURL(sponsors.sponsor3) : null,
    ]);
    setFileNames([sponsors.sponsor1?.name || null, sponsors.sponsor2?.name || null, sponsors.sponsor3?.name || null]);
  }, [flyerFormStore.flyerFormDetail.sponsors]);

  // -----------------------------
  // ✅ Handle file upload
  // -----------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Update MobX store
    if (index === 0) flyerFormStore.updateSponsor("sponsor1", file);
    if (index === 1) flyerFormStore.updateSponsor("sponsor2", file);
    if (index === 2) flyerFormStore.updateSponsor("sponsor3", file);

    // Local preview
    const reader = new FileReader();
    reader.onload = () => {
      const newImages = [...sponsorImages];
      newImages[index] = reader.result as string;
      setSponsorImages(newImages);

      const newFileNames = [...fileNames];
      newFileNames[index] = file.name;
      setFileNames(newFileNames);
    };
    reader.readAsDataURL(file);
  };

  // -----------------------------
  // ✅ Remove image
  // -----------------------------
  const removeImage = (index: number) => {
    if (index === 0) flyerFormStore.updateSponsor("sponsor1", null);
    if (index === 1) flyerFormStore.updateSponsor("sponsor2", null);
    if (index === 2) flyerFormStore.updateSponsor("sponsor3", null);

    const newImages = [...sponsorImages];
    newImages[index] = null;
    setSponsorImages(newImages);

    const newFileNames = [...fileNames];
    newFileNames[index] = null;
    setFileNames(newFileNames);
  };

  return (
    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-bold">Sponsors</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["Sponsor 1", "Sponsor 2", "Sponsor 3"].map((label, index) => (
          <div key={index} className="flex flex-col gap-2 items-center">
            {/* Hidden file input */}
            <input
              ref={sponsorRefs[index]}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, index)}
            />

            {/* Show upload button only if no image */}
            {!sponsorImages[index] && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex items-center gap-2 border-primary text-primary hover:!bg-gray-950 hover:text-primary"
                onClick={() => sponsorRefs[index].current?.click()}
              >
                <Upload className="h-4 w-4" />
                {label} Upload
              </Button>
            )}

            {/* Show image with small cross button if image exists */}
            {sponsorImages[index] && (
              <div className="relative">
                <img
                  src={sponsorImages[index]!}
                  alt={label}
                  className="w-16 h-16 object-contain border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-primary"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default SponsorsBlock;
