"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, History, FolderOpen, Save, LogOut, User, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import { useChatHistory } from "@/components/chat/chat-history-context";
import { ChatListItem } from "@/components/chat/chat-list-item";
import { Button } from "@/components/ui/button";
import { HoloCard } from "@/components/ui/holo-card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";

const ITEMS_PER_PAGE = 10; // Number of chat sessions to show per page

export function ChatSidebar() {
    const { sessions, activeSessionId, setActiveSession, createSession, deleteSession, updateSessionTitle, clearAllSessions, storageMode } = useChatHistory();
    const { user, isGuest, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination calculations
    const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedSessions = useMemo(() => {
        return sessions.slice(startIndex, endIndex);
    }, [sessions, startIndex, endIndex]);

    // Reset to page 1 if current page is out of bounds or when sessions change significantly
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // Navigate to page containing active session when it changes (but only when activeSessionId changes, not currentPage)
    useEffect(() => {
        if (activeSessionId && sessions.length > 0) {
            const activeIndex = sessions.findIndex(s => s.id === activeSessionId);
            if (activeIndex !== -1) {
                const pageForActive = Math.floor(activeIndex / ITEMS_PER_PAGE) + 1;
                const newTotalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
                if (pageForActive <= newTotalPages && pageForActive > 0) {
                    // Use functional update to avoid stale closure
                    setCurrentPage(prev => {
                        // Only navigate if the active session is on a different page
                        if (prev !== pageForActive) {
                            return pageForActive;
                        }
                        return prev;
                    });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSessionId, sessions.length]); // Only depend on activeSessionId and sessions.length, not currentPage

    const handlePreviousPage = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleFirstPage = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setCurrentPage(1);
    };

    const handleLastPage = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setCurrentPage(totalPages);
    };

    return (
        <motion.div
            initial={{ width: 320 }}
            animate={{ width: isCollapsed ? 60 : 320 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="h-full flex flex-col relative"
        >
            <HoloCard className="h-full flex flex-col p-0 overflow-hidden bg-black/40 backdrop-blur-xl border-cyan-500/20">

                {/* Header */}
                <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between shrink-0">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                                <History size={16} className="text-cyan-400" />
                            </div>
                            <span className="font-mono text-sm font-bold text-cyan-100 tracking-wider">
                                HISTORY
                            </span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="ml-auto h-8 w-8 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                </div>

                {/* New Chat Button */}
                <div className="p-4 shrink-0">
                    <Button
                        onClick={() => {
                            createSession();
                            setCurrentPage(1); // Reset to first page to see new session
                        }}
                        className={cn(
                            "w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all",
                            isCollapsed ? "px-0" : "justify-start gap-2"
                        )}
                    >
                        <Plus size={18} />
                        {!isCollapsed && "New Session"}
                    </Button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-hidden relative">
                    {!isCollapsed ? (
                        <div
                            className="h-full px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent"
                            data-lenis-prevent="true"
                        >
                            <div className="flex flex-col gap-1 pb-4">
                                {sessions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-2">
                                        <FolderOpen size={32} className="opacity-50" />
                                        <span className="text-xs">No active sessions</span>
                                    </div>
                                ) : (
                                    <>
                                        {paginatedSessions.map((session) => (
                                            <ChatListItem
                                                key={session.id}
                                                session={session}
                                                isActive={session.id === activeSessionId}
                                                onSelect={() => setActiveSession(session.id)}
                                                onDelete={() => deleteSession(session.id)}
                                                onRename={(title) => updateSessionTitle(session.id, title)}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 pt-4">
                            {/* Show active or recent icons when collapsed */}
                            {sessions.slice(0, 5).map(s => (
                                <div
                                    key={s.id}
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all",
                                        s.id === activeSessionId
                                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_currentColor]"
                                            : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50"
                                    )}
                                    onClick={() => setActiveSession(s.id)}
                                    title={s.title}
                                >
                                    <span className="text-[10px] font-bold">{s.title.charAt(0).toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {!isCollapsed && sessions.length > ITEMS_PER_PAGE && (
                    <div className="px-4 py-3 border-t border-cyan-500/10 shrink-0">
                        <div className="flex items-center justify-between gap-2">
                            {/* Previous Button */}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleFirstPage(e)}
                                    disabled={currentPage === 1}
                                    className="h-7 w-7 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="First page"
                                    type="button"
                                >
                                    <ChevronsLeft size={14} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handlePreviousPage(e)}
                                    disabled={currentPage === 1}
                                    className="h-7 w-7 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Previous page"
                                    type="button"
                                >
                                    <ChevronLeft size={14} />
                                </Button>
                            </div>

                            {/* Page Info */}
                            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                                <span className="text-cyan-300">{currentPage}</span>
                                <span className="text-zinc-600">/</span>
                                <span>{totalPages}</span>
                            </div>

                            {/* Next Button */}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleNextPage(e)}
                                    disabled={currentPage === totalPages}
                                    className="h-7 w-7 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Next page"
                                    type="button"
                                >
                                    <ChevronRight size={14} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleLastPage(e)}
                                    disabled={currentPage === totalPages}
                                    className="h-7 w-7 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Last page"
                                    type="button"
                                >
                                    <ChevronsRight size={14} />
                                </Button>
                            </div>
                        </div>
                        {/* Total sessions count */}
                        <div className="mt-2 text-center">
                            <span className="text-[10px] text-zinc-600">
                                {sessions.length} session{sessions.length !== 1 ? 's' : ''} total
                            </span>
                        </div>
                    </div>
                )}

                {/* Footer */}
                {!isCollapsed && (
                    <div className="p-4 border-t border-cyan-500/10 shrink-0 space-y-3">
                        {/* User Info / Guest Status */}
                        <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-zinc-900/50 border border-cyan-500/10">
                            <div className="p-1 rounded bg-cyan-500/10">
                                <User size={12} className="text-cyan-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-cyan-300 truncate">
                                    {user ? (user.name || user.email) : "Guest Mode"}
                                </p>
                                <p className="text-[9px] text-zinc-500 truncate">
                                    {user ? user.email : "No account"}
                                </p>
                            </div>
                        </div>

                        {/* Storage Mode & Actions */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                {storageMode === 'local' ? (
                                    <>
                                        <Save size={12} className="text-green-500" />
                                        <span>Local Sync Active</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={12} className="text-amber-500" />
                                        <span>Browser Storage</span>
                                    </>
                                )}
                            </div>

                            {sessions.length > 0 && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-zinc-600 hover:text-red-400"
                                    onClick={clearAllSessions}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            )}
                        </div>

                        {/* Logout Button (only if authenticated or guest) */}
                        {(user || isGuest) && (
                            <Button
                                onClick={logout}
                                variant="ghost"
                                className="w-full justify-start gap-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 text-xs h-8"
                            >
                                <LogOut size={12} />
                                {user ? "Logout" : "Exit Guest Mode"}
                            </Button>
                        )}
                    </div>
                )}
            </HoloCard>
        </motion.div>
    );
}
