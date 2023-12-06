import { RefObject, useEffect, useState } from "react";

export default function useOutsideClick(ref: RefObject<HTMLElement | null>) {
    const [isClicked, setIsClicked] = useState<boolean | undefined>();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsClicked(true);
            } else {
                setIsClicked(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        }, [ref]);
    return isClicked;
}