import React from "react";

function FilterBar({ search, setSearch,filterStore,setFilterStore }) {
  return (
   
    <div className="max-w-[450px] md:max-w-xl mx-auto mt-6 flex flex-col md:flex-row gap-3 w-full">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search product..."
        
        className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm shadow-sm bg-white"
      />
      <input 
        value={filterStore}
        onChange={(e) => setFilterStore(e.target.value)}
        placeholder="Filter by Store..."
        className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm shadow-sm bg-white"
      />
    </div>
  );
}

export default FilterBar;