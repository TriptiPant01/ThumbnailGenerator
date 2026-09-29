import { colorSchemes } from "../types";

const ColorSchemeSelector = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (color: string) => void;
}) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-50">Color Scheme</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {colorSchemes.map((scheme) => {
                    const isSelected = value === scheme.id;

                    return (
                        <button
                            key={scheme.id}
                            type="button"
                            onClick={() => onChange(scheme.id)}
                            title={scheme.name}
                            className={[
                                "relative overflow-hidden rounded-xl border transition-all",
                                isSelected ? "border-pink-400 ring-2 ring-pink-500/60" : "border-white/10",
                            ].join(" ")}
                        >
                            <div
                                className="flex h-12 w-full rounded-lg"
                                style={{
                                    background: `linear-gradient(90deg, ${scheme.colors[0]} 0%, ${scheme.colors[1]} 50%, ${scheme.colors[2]} 100%)`,
                                }}
                            />
                        </button>
                    );
                })}
            </div>
            <p className="text-sm text-zinc-300">Selected: {colorSchemes.find((s) => s.id === value)?.name}</p>
        </div>
    );
};

export default ColorSchemeSelector