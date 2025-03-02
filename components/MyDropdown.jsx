'use client';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChevronDown,  FileText, GraduationCap, LayoutDashboard, PenBox, Stars } from "lucide-react";
import Link from 'next/link'; // or your preferred Link component

const MyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}> {/* Toggle open/close */}
          <Stars className="h-4 w-4" />
          <span className="hidden md:block">Grouth Tools</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleItemClick}> {/* Close on click */}
          <Link href="/resume" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Resume Builder</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleItemClick}> {/* Close on click */}
          <Link href="/ai-cover-letter" className="flex items-center gap-2">
            <PenBox className="h-4 w-4" />
            <span>Cover Letter</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleItemClick}> {/* Close on click */}
          <Link href="/interview" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Interview Prep</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MyDropdown;