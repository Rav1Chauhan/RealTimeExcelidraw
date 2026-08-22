import { ReactNode } from "react";

interface IconButtonProps {
    icon: ReactNode;
    onClick: () => void;
    activated: boolean;
}

export function IconButton({
    icon,
    onClick,
    activated,
}: IconButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`m-2 cursor-pointer rounded-full border bg-black p-2 transition-colors hover:bg-gray-800 ${activated ? "text-red-400" : "text-white"
                }`}
        >
            {icon}
        </button>
    );
}