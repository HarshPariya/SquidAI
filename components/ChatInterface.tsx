import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Sparkles, 
  Code, 
  Shield, 
  Brain,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Mic,
  MicOff,
  ImagePlus,
  FileText
} from 'lucide-react';
import { SquidAICore } from '@/components/ui/squidai-core';
import { useChatHistory } from '@/components/chat/chat-history-context';
import { useAuth } from '@/components/auth/auth-context';
import { ChatListItem } from '@/components/chat/chat-list-item';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrls?: string[];
}

interface AttachedFile {
  id: string;
  file: File;
  dataUrl: string; // blob URL for images, '' for documents
  mimeType: string;
}

const ITEMS_PER_PAGE = 10;

export function ChatInterface({ onClose }: { onClose: () => void }) {
  const { 
    sessions, 
    activeSessionId, 
    setActiveSession, 
    createSession, 
    addMessageToSession,
    updateSessionTitle,
    deleteSession
  } = useChatHistory();
  const { user, isAuthenticated, isGuest, logout } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Initial systems check complete. SquidAI remains ready to serve.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingQueue, setStreamingQueue] = useState('');
  const [displayedStreaming, setDisplayedStreaming] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ dataUrl: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/*";
  const ACCEPTED_ALL_TYPES = "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/*,application/pdf,.pdf,.doc,.docx";
  const ACCEPTED_IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp)$/i;
  const ACCEPTED_DOC_EXT = /\.(pdf|docx?)$/i;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_DOC_SIZE = 20 * 1024 * 1024; // 20MB for PDF/Word
  const MAX_ATTACHMENTS = 4;

  const isAcceptedImage = (file: File): boolean => {
    if (file.size > MAX_IMAGE_SIZE) return false;
    if (file.type && (ACCEPTED_IMAGE_TYPES.includes(file.type) || file.type.startsWith("image/"))) return true;
    const hasImageExt = ACCEPTED_IMAGE_EXT.test(file.name);
    const genericType = !file.type || file.type === "application/octet-stream";
    if (hasImageExt && (genericType || file.type.startsWith("image/"))) return true;
    return false;
  };

  const isAcceptedDoc = (file: File): boolean => {
    if (file.size > MAX_DOC_SIZE) return false;
    if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/msword") return true;
    return ACCEPTED_DOC_EXT.test(file.name);
  };

  const isAcceptedFile = (file: File): boolean => isAcceptedImage(file) || isAcceptedDoc(file);
  const requestInFlight = useRef(false);
  const cooldownRef = useRef(false);

  const {
    isListening,
    transcript,
    isSupported: isVoiceSupported,
    error: voiceError,
    toggleListening,
    stopAndGetTranscript,
  } = useSpeechRecognition();

  const activeModules = [
    { name: 'Inference Engine', active: true },
    { name: 'Neural Core', active: true },
    { name: 'Memory & Retrieval', active: true },
    { name: 'Code Synthesis', active: true }
  ];

  // Pagination calculations
  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSessions = useMemo(() => {
    return sessions.slice(startIndex, endIndex);
  }, [sessions, startIndex, endIndex]);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Load messages when active session changes
  useEffect(() => {
    if (activeSessionId) {
      const session = sessions.find(s => s.id === activeSessionId);
      if (session && session.messages.length > 0) {
        const loadedMessages: Message[] = session.messages.map((msg, idx) => ({
          id: `${session.id}-${idx}`,
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.text,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(loadedMessages);
      } else {
        // New session or empty session
        setMessages([{
          id: '1',
          role: 'assistant',
          content: 'Initial systems check complete. SquidAI remains ready to serve.',
          timestamp: new Date()
        }]);
      }
    } else {
      // No active session
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Initial systems check complete. SquidAI remains ready to serve.',
        timestamp: new Date()
      }]);
    }
  }, [activeSessionId, sessions]);

  // Navigate to page containing active session when it changes
  useEffect(() => {
    if (activeSessionId && sessions.length > 0) {
      const sessionIndex = sessions.findIndex(s => s.id === activeSessionId);
      if (sessionIndex !== -1) {
        const targetPage = Math.floor(sessionIndex / ITEMS_PER_PAGE) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
    }
  // Intentionally omit currentPage/sessions to avoid resetting page on every session change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId, sessions.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      const finalTranscript = stopAndGetTranscript();
      if (finalTranscript.trim()) {
        setInput((prev) => (prev.trim() ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
      }
    } else {
      toggleListening();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedStreaming, streamingQueue]);

  const handleNewSession = async () => {
    await createSession();
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Initial systems check complete. SquidAI remains ready to serve.',
      timestamp: new Date()
    }]);
    setInput('');
    setAttachedFiles([]);
  };

  const mimeFromExtension = (name: string): string => {
    const ext = name.replace(/.*\./, "").toLowerCase();
    const map: Record<string, string> = {
      jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", bmp: "image/bmp",
      pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };
    return map[ext] ?? "application/octet-stream";
  };

  const attachedFilesRef = useRef<AttachedFile[]>([]);
  attachedFilesRef.current = attachedFiles;

  const addFiles = (fileList: FileList | null | File[]): number => {
    if (!fileList?.length) return 0;
    const files = Array.from(fileList);
    const newFiles: AttachedFile[] = [];
    const currentCount = attachedFilesRef.current.length;
    const limit = MAX_ATTACHMENTS - currentCount;
    if (limit <= 0) return 0;
    let added = 0;
    for (let i = 0; i < files.length && added < limit; i++) {
      const file = files[i];
      if (!isAcceptedFile(file)) continue;
      const isImage = isAcceptedImage(file);
      const dataUrl = isImage ? URL.createObjectURL(file) : "";
      newFiles.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
        file,
        dataUrl,
        mimeType: file.type || mimeFromExtension(file.name),
      });
      added++;
    }
    if (newFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...newFiles].slice(0, MAX_ATTACHMENTS));
    }
    return added;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    addFiles(files);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (attachedFilesRef.current.length >= MAX_ATTACHMENTS || isTyping || requestInFlight.current) return;
    const types = Array.from(e.dataTransfer.types);
    const hasFiles = types.length === 0 || types.includes('Files') || types.some((t) => t.startsWith('application/') || t.startsWith('image/'));
    if (hasFiles) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const related = e.relatedTarget as Node | null;
    if (!related || !e.currentTarget.contains(related)) setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (attachedFilesRef.current.length >= MAX_ATTACHMENTS || isTyping || requestInFlight.current) return;
    let files: File[] = [];
    if (e.dataTransfer.items?.length) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === "file") {
          const f = item.getAsFile();
          if (f) files.push(f);
        }
      }
    }
    if (!files.length && e.dataTransfer.files?.length) files = Array.from(e.dataTransfer.files);
    if (files.length) addFiles(files);
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      const removed = prev.find((f) => f.id === id);
      if (removed?.dataUrl?.startsWith("blob:")) URL.revokeObjectURL(removed.dataUrl);
      return next;
    });
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1] || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** Convert image file to data URL so it persists in the message until chat is closed */
  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    const preventDefault = (ev: DragEvent) => {
      ev.preventDefault();
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = "copy";
    };
    document.body.addEventListener("dragover", preventDefault, false);
    document.body.addEventListener("drop", preventDefault, false);
    return () => {
      document.body.removeEventListener("dragover", preventDefault, false);
      document.body.removeEventListener("drop", preventDefault, false);
      attachedFilesRef.current.forEach((f) => {
        if (f.dataUrl?.startsWith("blob:")) URL.revokeObjectURL(f.dataUrl);
      });
    };
  }, []);

  const handleChatClick = async (sessionId: string) => {
    setActiveSession(sessionId);
  };

  const handleSend = async () => {
    const hasText = input.trim().length > 0;
    const hasImages = attachedFiles.length > 0;
    if ((!hasText && !hasImages) || requestInFlight.current || isTyping || cooldownRef.current) return;

    const userMessageText = input.trim() || "What do you see in these images? Please describe or answer any question about them.";
    
    // Create session if none exists
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = await createSession(userMessageText);
    }

    const filesToSend = [...attachedFiles];
    // Convert attached images to data URLs so they stay visible in the chat until the user closes the AI
    const imageUrlsForMessage = await Promise.all(
      filesToSend.filter((f) => isAcceptedImage(f.file)).map((f) => fileToDataUrl(f.file))
    );
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageText,
      timestamp: new Date(),
      ...(imageUrlsForMessage.length > 0 && { imageUrls: imageUrlsForMessage }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);
    setStreamingQueue('');
    setDisplayedStreaming('');
    requestInFlight.current = true;
    cooldownRef.current = true;

    try {
      // Build history from existing messages (last 4 messages for context)
      const relevantMessages = messages.filter(m => m.id !== '1' || m.role !== 'assistant');
      const historyMessages = relevantMessages.slice(-4).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: m.content,
      }));

      // Save search to MongoDB (fire-and-forget; doesn't block chat)
      fetch("/api/save-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessageText,
          ...(user && { userId: user.id, userEmail: user.email }),
          ...(currentSessionId && { sessionId: currentSessionId }),
        }),
      }).catch(() => {});

      let imagesForApi: { mimeType: string; data: string }[] | undefined;
      if (filesToSend.length > 0) {
        imagesForApi = await Promise.all(
          filesToSend.map(async (f) => ({ mimeType: f.mimeType, data: await fileToBase64(f.file) }))
        );
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: historyMessages,
          message: userMessageText,
          ...(imagesForApi && imagesForApi.length > 0 && { images: imagesForApi }),
        }),
      });

      // Handle rate limit
      if (response.status === 429) {
        try {
          const errorData = await response.json();
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: errorData.error || "⏳ **Rate limit reached.** Please wait a few seconds before sending another message.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        } catch {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "⏳ **Rate limit reached.** Please wait a few seconds before sending another message.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
        return;
      }

      if (!response.ok) {
        let errorMessage = `Server Error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Error (${response.status}):** ${errorMessage}\n\n**Troubleshooting:**\n- Check your GEMINI_API_KEY is set in .env.local\n- Verify the API key is valid at https://ai.google.dev/\n- Ensure you have sufficient quota\n- Restart your dev server after adding the API key\n- Check server logs for more details`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      if (!response.body) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "⚠️ **Error:** Empty response from server. Please try again.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        // push chunk into queue for the typing consumer
        setStreamingQueue((prev) => prev + chunk);
      }

      // Brief yield so React can paint the final streamed chunk before we add the message
      await new Promise((r) => setTimeout(r, 50));

      // Add final message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: accumulatedResponse,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
      setStreamingQueue('');
      setDisplayedStreaming('');

      // Save messages to session
      if (currentSessionId) {
        await addMessageToSession(currentSessionId, {
          role: 'user',
          text: userMessageText,
          timestamp: userMessage.timestamp.toISOString()
        });
        await addMessageToSession(currentSessionId, {
          role: 'model',
          text: accumulatedResponse,
          timestamp: aiMessage.timestamp.toISOString()
        });
      }

      // Save chat messages to MongoDB (fire-and-forget)
      const saveMsg = (role: "user" | "model", content: string) => {
        fetch("/api/save-chat-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: currentSessionId,
            ...(user && { userId: user.id, userEmail: user.email }),
            role,
            content,
          }),
        }).catch(() => {});
      };
      saveMsg("user", userMessageText);
      saveMsg("model", accumulatedResponse);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **System Issue:** ${errorMsg}\n\n**Troubleshooting:**\n- Check your GEMINI_API_KEY is set in .env.local\n- Verify the API key is valid at https://ai.google.dev/\n- Restart your dev server after adding the API key\n- Check your network connection\n- Try again in a moment`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setStreamingQueue('');
      setDisplayedStreaming('');
      requestInFlight.current = false;
      
      // Cooldown reset (2 seconds)
      setTimeout(() => {
        cooldownRef.current = false;
      }, 2000);
    }
  };

  // Show streamed text as it arrives (no per-character delay — much faster replies)
  useEffect(() => {
    setDisplayedStreaming(streamingQueue);
  }, [streamingQueue]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Close sidebars when clicking outside on mobile
  useEffect(() => {
    if (!showSidebar && !showHistory) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (window.innerWidth < 640) {
        if (showSidebar && !target.closest('aside') && !target.closest('[data-sidebar-toggle]')) {
          setShowSidebar(false);
        }
        if (showHistory && !target.closest('aside') && !target.closest('[data-history-toggle]')) {
          setShowHistory(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSidebar, showHistory]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Mobile Overlay */}
      {(showSidebar || showHistory) && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowSidebar(false);
            setShowHistory(false);
          }}
        />
      )}

      {/* Left Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            className="w-64 sm:w-64 md:w-72 bg-gradient-to-b from-black to-red-950/10 border-r border-pink-500/20 flex flex-col fixed sm:relative inset-y-0 left-0 z-50 sm:z-auto"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Logo */}
            <div className="p-4 sm:p-6 border-b border-pink-500/20">
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" animate={{ boxShadow: ['0 0 18px rgba(244,63,94,0.45)', '0 0 36px rgba(244,63,94,0.6)', '0 0 18px rgba(244,63,94,0.45)'] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
                  <SquidAICore status="idle" className="w-12 h-12 sm:w-16 sm:h-16" />
                </motion.div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 truncate">
                    SquidAI
                  </h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 truncate">SquidAI Nexus</p>
                </div>
                {/* Mobile close button */}
                <button
                  onClick={() => setShowSidebar(false)}
                  className="ml-auto sm:hidden text-gray-400 hover:text-pink-500 p-1"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Active Modules */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xs sm:text-sm text-pink-400 mb-3 sm:mb-4 flex items-center gap-2 uppercase tracking-wide font-semibold">
                  <Brain size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">SYSTEM MODULES</span>
                  <span className="sm:hidden">MODULES</span>
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {activeModules.map((module, index) => (
                    <motion.div
                      key={module.name}
                      className="flex items-center justify-between text-xs sm:text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <span className="text-gray-300 truncate pr-2">{module.name}</span>
                      <div className="flex items-center flex-shrink-0">
                        <motion.div
                          className="relative w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center"
                          animate={module.active ? { scale: [1, 1.06, 1] } : {}}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <motion.span
                            className={`absolute inset-0 rounded-full ${module.active ? 'bg-pink-500/30' : 'bg-gray-700'}`}
                            animate={module.active ? { opacity: [0.5, 1, 0.5], scale: [1, 1.25, 1] } : {}}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <span className={`absolute inset-0.5 sm:inset-1 rounded-full ${module.active ? 'bg-pink-500' : 'bg-gray-600'}`} />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 sm:p-4 border-t border-pink-500/20 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  className="p-2 sm:p-3 bg-gradient-to-br from-pink-500/8 to-red-500/8 border border-pink-500/30 rounded-lg flex flex-col items-center gap-1 hover:border-pink-500 transition-colors touch-manipulation"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Code size={18} className="sm:w-5 sm:h-5 text-pink-400" />
                  <span className="text-[10px] sm:text-xs md:text-sm text-pink-300 text-center leading-tight">Code</span>
                </motion.button>
                <motion.button
                  className="p-2 sm:p-3 bg-gradient-to-br from-pink-500/8 to-red-500/8 border border-pink-500/30 rounded-lg flex flex-col items-center gap-1 hover:border-pink-500 transition-colors touch-manipulation"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Shield size={18} className="sm:w-5 sm:h-5 text-pink-400" />
                  <span className="text-[10px] sm:text-xs md:text-sm text-pink-300 text-center leading-tight">Integrations</span>
                </motion.button>
              </div>
              {(isAuthenticated || isGuest) && (
                <motion.button
                  onClick={logout}
                  className="w-full p-2 sm:p-3 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-600/50 rounded-lg flex items-center justify-center gap-2 text-gray-300 hover:text-pink-400 transition-colors touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={16} className="sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs md:text-sm">Logout</span>
                </motion.button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 sm:h-16 border-b border-pink-500/20 flex items-center justify-between px-3 sm:px-4 md:px-6 bg-black/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
            <motion.button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-pink-500 hover:text-pink-400 flex-shrink-0 p-1.5 touch-manipulation"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-sidebar-toggle
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </motion.button>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl text-white truncate font-semibold">
              {activeSession?.title || 'New Session'}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(isAuthenticated || isGuest) && (
              <motion.button
                onClick={logout}
                className="text-gray-400 hover:text-pink-500 transition-colors flex-shrink-0 p-1.5 touch-manipulation flex items-center gap-1.5"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Logout"
              >
                <LogOut size={18} />
                <span className="text-xs hidden sm:inline">Logout</span>
              </motion.button>
            )}
            <motion.button
              onClick={() => setShowHistory(!showHistory)}
              className="text-gray-400 hover:text-pink-500 transition-colors flex-shrink-0 p-1.5 sm:hidden touch-manipulation"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-history-toggle
              aria-label="Toggle history"
            >
              <MessageSquare size={20} />
            </motion.button>
            <motion.button
              onClick={onClose}
              className="text-gray-400 hover:text-pink-500 transition-colors flex-shrink-0 p-1.5 touch-manipulation"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close chat"
            >
              <X size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </motion.button>
          </div>
        </header>

        {/* Chat content + drop zone (messages + input) */}
        <div
          className={`flex-1 flex flex-col min-h-0 ${isDraggingOver ? 'bg-pink-500/10' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex gap-2 sm:gap-3 md:gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-pink-500 to-red-500'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800'
                }`}>
                  {message.role === 'assistant' ? (
                    <Sparkles size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  ) : (
                    <MessageSquare size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  )}
                </div>

                <div className={`max-w-[80%] sm:max-w-[75%] md:max-w-[70%] rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 shadow-sm transition-all duration-200 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-white rounded-tr-none sm:rounded-tr-none'
                    : 'bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/30 text-gray-200 rounded-tl-none sm:rounded-tl-none'
                }`}>
                  <div className="text-[9px] sm:text-[10px] md:text-xs font-bold mb-0.5 sm:mb-1 uppercase tracking-wider opacity-60">
                    {message.role === 'user' ? 'user' : 'assistant'}
                  </div>
                  {message.imageUrls && message.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {message.imageUrls.map((url, i) => (
                        // eslint-disable-next-line @next/next/no-img-element -- dynamic blob/data URLs from chat attachments
                        <img
                          key={i}
                          src={url}
                          alt={`Attached ${i + 1}`}
                          className="max-h-32 max-w-full rounded-lg object-contain border border-gray-600/50"
                        />
                      ))}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words leading-relaxed text-xs sm:text-sm md:text-base">
                    {message.content}
                  </div>
                  <div className="text-[8px] sm:text-[9px] md:text-[10px] mt-1 sm:mt-1.5 md:mt-2 opacity-40 text-right italic">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming message */}
          {displayedStreaming && (
            <motion.div
              className="flex gap-2 sm:gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-xl sm:rounded-2xl rounded-tl-none px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 shadow-sm max-w-[80%] sm:max-w-[75%] md:max-w-[70%]">
                <div className="text-[9px] sm:text-[10px] md:text-xs font-bold mb-0.5 sm:mb-1 uppercase tracking-wider opacity-60 text-pink-400">
                  ASSISTANT
                </div>
                <div className="whitespace-pre-wrap break-words leading-relaxed text-xs sm:text-sm md:text-base text-gray-200">
                  {displayedStreaming}
                  <span className="inline-block w-1.5 sm:w-2 h-3 sm:h-4 bg-pink-500 ml-1 animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}

          {isTyping && !displayedStreaming && !streamingQueue && (
            <motion.div
              className="flex gap-2 sm:gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - drop zone like ChatGPT: drop on this area or the text field to add files */}
        <div
          className={`p-3 sm:p-4 md:p-6 border-t border-pink-500/20 bg-black/50 backdrop-blur-sm flex-shrink-0 transition-colors rounded-t-lg ${isDraggingOver ? 'ring-2 ring-pink-500/50 ring-inset' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {voiceError && isListening && (
            <p className="text-red-400 text-xs mb-2">{voiceError}</p>
          )}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachedFiles.map((f) => {
                const isImage = f.dataUrl?.startsWith("blob:");
                return (
                  <div
                    key={f.id}
                    className="relative inline-block rounded-lg overflow-hidden border border-pink-500/30 group"
                  >
                    {isImage ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ dataUrl: f.dataUrl, name: f.file.name })}
                        className="block w-full h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg"
                        aria-label="View image full size"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- blob URL from user attachment */}
                        <img
                          src={f.dataUrl}
                          alt={f.file.name}
                          className="h-16 w-16 sm:h-20 sm:w-20 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </button>
                    ) : (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 flex flex-col items-center justify-center bg-pink-500/10 border-0">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" />
                        <span className="text-[10px] text-gray-400 truncate max-w-full px-1 mt-0.5">{f.file.name}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeAttachedFile(f.id); }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors z-10"
                      aria-label="Remove attachment"
                    >
                      <X size={12} />
                    </button>
                    {isImage && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-gray-300 truncate px-1 py-0.5">
                        {f.file.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-2 sm:gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_ALL_TYPES}
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachedFiles.length >= MAX_ATTACHMENTS || requestInFlight.current || isTyping}
              className="flex-shrink-0 p-2.5 sm:p-3 md:p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/30 text-pink-400 hover:border-pink-500 hover:bg-pink-500/20 flex items-center justify-center min-w-[44px] sm:min-w-[52px] touch-manipulation transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Attach image or file"
              title="Add image or file: click or drag & drop (images, PDF, Word – max 5MB images, 20MB docs)"
            >
              <ImagePlus size={20} className="sm:w-5 sm:h-5" />
            </motion.button>
            {isVoiceSupported && (
              <motion.button
                onClick={handleVoiceToggle}
                disabled={requestInFlight.current || isTyping || cooldownRef.current}
                className={`flex-shrink-0 p-2.5 sm:p-3 md:p-4 rounded-lg flex items-center justify-center min-w-[44px] sm:min-w-[52px] touch-manipulation transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening
                    ? "bg-red-500/30 border-2 border-red-500 text-red-400 animate-pulse"
                    : "bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/30 text-pink-400 hover:border-pink-500 hover:bg-pink-500/20"
                }`}
                whileHover={{ scale: requestInFlight.current || isTyping ? 1 : 1.05 }}
                whileTap={{ scale: requestInFlight.current || isTyping ? 1 : 0.95 }}
                aria-label={isListening ? "Stop listening" : "Voice input"}
                title={isListening ? "Stop listening" : "Speak to type"}
              >
                {isListening ? (
                  <MicOff size={20} className="sm:w-5 sm:h-5" />
                ) : (
                  <Mic size={20} className="sm:w-5 sm:h-5" />
                )}
              </motion.button>
            )}
            <input
              type="text"
              value={isListening && transcript ? `${input}${input ? " " : ""}${transcript}` : input}
              onChange={(e) => !isListening && setInput(e.target.value)}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                handleDragOver(e);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrop(e);
              }}
              onPaste={(e) => {
                if (attachedFiles.length >= MAX_ATTACHMENTS || isTyping || requestInFlight.current) return;
                const items = e.clipboardData?.items;
                if (!items?.length) return;
                const files: File[] = [];
                for (let i = 0; i < items.length; i++) {
                  if (items[i].type?.startsWith("image/")) {
                    const file = items[i].getAsFile();
                    if (file && isAcceptedImage(file)) files.push(file);
                  }
                }
                if (files.length > 0) {
                  e.preventDefault();
                  addFiles(files);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message or drop images here…"
              className="flex-1 bg-gradient-to-r from-pink-500/5 to-red-500/5 border border-pink-500/30 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors touch-manipulation"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              readOnly={isListening}
            />
            <motion.button
              onClick={handleSend}
              className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-white flex items-center justify-center gap-1 sm:gap-2 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] sm:min-w-[56px]"
              whileHover={{ scale: (!input.trim() && !transcript && attachedFiles.length === 0) ? 1 : 1.05 }}
              whileTap={{ scale: (!input.trim() && !transcript && attachedFiles.length === 0) ? 1 : 0.95 }}
              disabled={(!input.trim() && !(isListening && transcript) && attachedFiles.length === 0) || isListening || requestInFlight.current || isTyping || cooldownRef.current}
              aria-label="Send message"
            >
              <Send size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
        </div>
      </div>

      {/* Right Sidebar - History */}
      <AnimatePresence>
        {showHistory && (
          <motion.aside
            className="w-full sm:w-80 md:w-96 bg-gradient-to-b from-black to-red-950/10 border-l border-pink-500/20 flex flex-col fixed sm:relative inset-y-0 right-0 z-50 sm:z-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* History Header */}
            <div className="p-4 sm:p-6 border-b border-pink-500/20 flex-shrink-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm text-pink-500 flex items-center gap-2 font-semibold">
                  <MessageSquare size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">HISTORY</span>
                  <span className="sm:hidden">CHATS</span>
                </h3>
                <motion.button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-pink-500 p-1 touch-manipulation"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close history"
                >
                  <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
              </div>

              <motion.button
                onClick={handleNewSession}
                className="w-full p-2.5 sm:p-3 bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-lg flex items-center justify-center gap-2 text-pink-500 hover:border-pink-500 transition-colors touch-manipulation text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span>New Session</span>
              </motion.button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 min-h-0">
              <div className="space-y-1.5 sm:space-y-2">
                {paginatedSessions.length === 0 ? (
                  <div className="text-center text-gray-500 text-xs sm:text-sm py-6 sm:py-8 px-4">
                    No chat history yet
                  </div>
                ) : (
                  paginatedSessions.map((session) => (
                    <ChatListItem
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      onSelect={() => {
                        handleChatClick(session.id);
                        // Close history on mobile after selection
                        if (window.innerWidth < 640) {
                          setShowHistory(false);
                        }
                      }}
                      onDelete={() => deleteSession(session.id)}
                      onRename={(title) => updateSessionTitle(session.id, title)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-3 sm:p-4 border-t border-pink-500/20 flex-shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <motion.button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1.5 sm:p-2 touch-manipulation min-w-[36px] sm:min-w-[40px] ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed opacity-50' : 'text-gray-400 hover:text-pink-500'}`}
                    whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                  </motion.button>
                  <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-center">
                    {getPageNumbers().map((page, idx) => (
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="text-gray-500 text-xs sm:text-sm px-1">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page as number)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-xs sm:text-sm transition-colors touch-manipulation ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                              : 'text-gray-400 hover:text-pink-500'
                          }`}
                          aria-label={`Go to page ${page}`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>
                  <motion.button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 sm:p-2 touch-manipulation min-w-[36px] sm:min-w-[40px] ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed opacity-50' : 'text-gray-400 hover:text-pink-500'}`}
                    whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                    whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle History Button (when hidden on desktop) */}
      {!showHistory && (
        <motion.button
          onClick={() => setShowHistory(true)}
          className="hidden sm:flex fixed right-0 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-gradient-to-l from-pink-500 to-red-500 text-white rounded-l-lg z-40 touch-manipulation"
          initial={{ x: 48 }}
          animate={{ x: 0 }}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          data-history-toggle
          aria-label="Show history"
        >
          <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
        </motion.button>
      )}

      {/* Full-size image preview lightbox */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setPreviewImage(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Escape' && setPreviewImage(null)}
            aria-label="Close preview"
          >
            <motion.div
              className="relative max-w-[95vw] max-h-[90vh] w-full flex flex-col items-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- blob URL for full-size preview */}
              <img
                src={previewImage.dataUrl}
                alt={previewImage.name}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
              <p className="mt-2 text-sm text-gray-400 truncate max-w-full px-2">{previewImage.name}</p>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute -top-2 -right-2 sm:top-0 sm:right-0 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
