import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <Input
        type="text"
        className="block w-full p-6 pl-10 text-sm text-white bg-neutral-800 rounded-full focus:ring-peach-400 focus:border-peach-400 outline-none"
        placeholder="Search users by username, or address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-neutral-600 hover:bg-neutral-500 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
} 