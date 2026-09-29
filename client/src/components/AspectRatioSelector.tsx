import { RectangleHorizontal, RectangleVertical, Square } from "lucide-react";

import type { AspectRatio, AspectRatioSelectorProps } from "../types";

const defaultOptions: AspectRatio[] = ["16:9", "1:1", "9:16"];

const iconMap: Record<AspectRatio, JSX.Element> = {
    "16:9": <RectangleHorizontal className="size-6" />,
    "1:1": <Square className="size-6" />,
    "9:16": <RectangleVertical className="size-6" />,
};

const AspectRatioSelector = ({
    value,
    onChange,
    options = defaultOptions,
}: AspectRatioSelectorProps) => {
    return (
        <div className="space-y-3 dark">
            <label className="block text-sm font-medium text-slate-200">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
                {options.map((ratio) => {
                    const isSelected = value === ratio;

                    return (
                        <button
                            key={ratio}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => onChange?.(ratio)}
                            className={[
                                "flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
                                isSelected
                                    ? "border-pink-400 bg-pink-500/10 text-pink-300"
                                    : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-pink-500",
                            ].join(" ")}
                        >
                            {iconMap[ratio]}
                            <span>{ratio}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AspectRatioSelector