"use client"

import { useState } from "react"
import { Search } from "lucide-react"

const categories = [
  { id: "defi", name: "DeFi" },
  { id: "gaming", name: "Gaming" },
  { id: "infra", name: "Infrastructure" },
  { id: "dao", name: "DAO" },
  { id: "lending", name: "Lending" },
  { id: "yield", name: "Yield" },
]

interface SearchComponentProps {
  searchText: string
  setSearchText: (text: string) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
}

const SearchComponent = ({
  searchText,
  setSearchText,
  selectedCategories,
  setSelectedCategories,
}: SearchComponentProps) => {
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    } else {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const clearSearch = () => {
    setSearchText("")
    setSelectedCategories([])
  }

  return (
    <div className="p-4 mb-8">
      <div className="flex flex-col gap-6">
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-4 pl-10 text-sm text-white bg-neutral-800 rounded-full focus:ring-peach-400 focus:border-peach-400 outline-none"
            placeholder="Search projects by name, description, or category..."
          />
        </div>

        <div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.includes(category.id)
                    ? "bg-peach-400 text-black"
                    : "bg-neutral-800 text-neutral-400 hover:bg-peach-400 hover:text-black"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchComponent
