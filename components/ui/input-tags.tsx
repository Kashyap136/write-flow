"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InputTagsProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function InputTags({
  value = [],
  onChange,
  placeholder = "Add tags...",
  className = "",
}: InputTagsProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === " ") &&
      inputValue.trim()
    ) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !value.includes(normalizedTag)) {
      const newTags = [...value, normalizedTag];
      onChange(newTags);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input ${className}`}
      onClick={handleContainerClick}
    >
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="px-2 py-1 text-sm">
          {tag}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove tag</span>
          </Button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 border-none shadow-none focus-visible:ring-0 p-0 min-w-[8rem] bg-transparent"
      />
    </div>
  );
}