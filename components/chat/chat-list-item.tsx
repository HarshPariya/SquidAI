"use client";

import { useState } from "react";
import { MessageSquare, Trash2, Edit2, Check, X, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatListItemProps {
    session: ChatSession;
    isActive: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onRename: (newTitle: string) => void;
}

export function ChatListItem({ session, isActive, onSelect, onDelete, onRename }: ChatListItemProps) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [editedTitle, setEditedTitle] = useState(session.title);

    const handleRename = () => {
        if (editedTitle.trim()) {
            onRename(editedTitle.trim());
            setIsRenaming(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleRename();
        if (e.key === "Escape") {
            setEditedTitle(session.title);
            setIsRenaming(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "group relative flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all mx-1 sm:mx-2 touch-manipulation min-h-11",
                isActive
                    ? "bg-pink-950/40 border border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.08)]"
                    : "hover:bg-white/5 border border-transparent active:bg-white/10"
            )}
            onClick={() => !isRenaming && onSelect()}
        >
            <MessageSquare
                size={14}
                className={cn(
                    "shrink-0 transition-colors sm:w-4 sm:h-4",
                    isActive ? "text-pink-500" : "text-zinc-500 group-hover:text-pink-500"
                )}
            />

            {isRenaming ? (
                <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                    <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="h-7 sm:h-8 text-xs sm:text-sm bg-black/50 border-pink-500/50 focus-visible:ring-0 px-2 flex-1"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-green-400 hover:text-green-300 hover:bg-green-500/20 touch-manipulation"
                        onClick={handleRename}
                        aria-label="Confirm rename"
                    >
                        <Check size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 touch-manipulation"
                        onClick={() => {
                            setEditedTitle(session.title);
                            setIsRenaming(false);
                        }}
                        aria-label="Cancel rename"
                    >
                        <X size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex-1 min-w-0 flex items-center justify-between group/item">
                    <div className="flex flex-col truncate min-w-0 flex-1">
                        <span className={cn(
                            "text-xs sm:text-sm font-medium truncate",
                            isActive ? "text-pink-100" : "text-zinc-400 group-hover:text-pink-200"
                        )}>
                            {session.title}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-zinc-600 truncate">
                            {new Date(session.updatedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8 opacity-0 sm:opacity-0 group-hover/item:opacity-100 sm:group-hover/item:opacity-100 text-zinc-400 hover:text-pink-500 hover:bg-pink-500/10 transition-all touch-manipulation shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="More options"
                            >
                                <MoreVertical size={14} className="sm:w-4 sm:h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-950 border-pink-500/20 min-w-[140px]">
                            <DropdownMenuItem
                                className="text-xs sm:text-sm hover:bg-pink-500/10 focus:bg-pink-500/10 cursor-pointer touch-manipulation"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setIsRenaming(true);
                                }}
                            >
                                <Edit2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-xs sm:text-sm text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 hover:text-red-300 cursor-pointer touch-manipulation"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </motion.div>
    );
}
