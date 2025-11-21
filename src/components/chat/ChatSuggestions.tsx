"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ChatSuggestionsProps {
    suggestions: string[];
    onSuggestionClick: (suggestion: string) => void;
}

/**
 * Chat suggestions/quick replies component
 */
const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
    suggestions,
    onSuggestionClick,
}) => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="px-4 py-3 border-t bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Gợi ý cho bạn:</p>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <Button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-full border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                    >
                        {suggestion}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ChatSuggestions;
