import { SearchIcon } from "@heroicons/react/outline";

const Widgets = () => {
  return (
    <div className="px-2 mt-2">
      <div
        className="mt-2 flex items-center space-x-2 
    rounded-full bg-gray-100 p-3"
      >
        <SearchIcon className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search Twitter"
          className="flex-1 bg-transparent outline-none"
        />
      </div>
    </div>
  );
};

export default Widgets;
