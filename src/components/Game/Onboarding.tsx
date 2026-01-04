import {GameScreenLayout} from "@/components/Game/GameScreenLayout.tsx";
import {motion} from "framer-motion";
import {feedback} from "@/services/soundFeedback.ts";
import {cn} from "@/components/ui/utils.ts";
import {useState} from "react";
import {useSessionStorage} from "@/hooks/useSessionStorage.ts";

interface OnboardingProps {
    onContinue: () => void;
}


export function Onboarding({ onContinue }: OnboardingProps) {
    const [selected, setSelected] = useState(0);
    const [currentLanguage, setCurrentLanguage] = useSessionStorage('current-language', 'en');

    const handleContinue = (languageKey: string) => {
        setCurrentLanguage(languageKey)

        if(currentLanguage === languageKey)
            return onContinue();

        setCurrentLanguage('en')
        onContinue();
    }
    const items = [
        {
            id: 'en',
            label: 'English',
            disabled: false,
        },
        {
            id: 'es',
            label: 'Español',
            disabled: true,
        },
        {
            id: 'fr',
            label: 'Français',
            disabled: true,
        },
    ];

    return (
        <GameScreenLayout zIndex={40000}>
            <div className="pb-8 text-white font-xl">
                Please select a language to continue
            </div>
            {/* Menu Options */}
            <div className="flex flex-col gap-4 w-full max-w-md">
                {items.map((item, index) => (
                    <motion.button
                        key={item.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        disabled={item.disabled}
                        onClick={() => {
                            if (item.disabled) return;
                            feedback.click();
                            handleContinue(item.id)
                        }}
                        onMouseEnter={() => {
                            if (item.disabled) return;
                            setSelected(index);
                            feedback.hover();
                        }}
                        className={cn(
                            "group relative w-full p-4 rounded-xl transition-all duration-200 border border-transparent",
                            !item.disabled && "hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                            item.disabled && "opacity-50 grayscale cursor-not-allowed",
                            selected === index && !item.disabled && "bg-white/10 border-white/20 shadow-lg"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-1 text-left">
                                <div className={cn(
                                    "text-lg font-bold tracking-wide transition-colors",
                                    item.disabled ? "text-zinc-500" : (selected === index ? "text-white" : "text-white/80")
                                )}>
                                    {item.label}
                                </div>
                            </div>
                            {selected === index && !item.disabled && (
                                <motion.div layoutId="cursor" className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>
        </GameScreenLayout>
    );
}