"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseAutoScrollOptions {
    offset?: number;
    smooth?: boolean; // Whether to use smooth scrolling for the manual jump
}

export function useAutoScroll<T extends HTMLElement>(dependencies: ReadonlyArray<unknown>, options: UseAutoScrollOptions = {}) {
    const scrollRef = useRef<T>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Default offset tolerance to 50px
    const offset = options.offset ?? 50;

    const scrollToBottom = useCallback((instant = false) => {
        if (!scrollRef.current) return;

        const target = scrollRef.current.scrollHeight;

        if (instant || !options.smooth) {
            scrollRef.current.scrollTop = target;
        } else {
            scrollRef.current.scrollTo({
                top: target,
                behavior: "smooth"
            });
        }
    }, [options.smooth]);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;

        // If within range, we are at bottom
        const atBottom = distanceToBottom < offset;

        setIsAtBottom(atBottom);
        setShowScrollButton(!atBottom);
    }, [offset]);

    // Effect: Scroll to bottom when dependencies change, IF we were already at bottom
    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom(true); // Instant scroll for "stickiness" during streaming to prevent visual jitter
        }
    }, [dependencies, isAtBottom, scrollToBottom]);

    return {
        scrollRef,
        isAtBottom,
        showScrollButton,
        scrollToBottom,
        handleScroll
    };
}
