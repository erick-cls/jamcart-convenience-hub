
interface NoStoresFoundProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const NoStoresFound = ({ searchTerm, onClearSearch }: NoStoresFoundProps) => {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold mb-2">No Stores Found</h3>
      <p className="text-gray-600">
        We couldn't find any stores matching "{searchTerm}".
      </p>
      {searchTerm && (
        <button
          className="mt-4 text-jamcart-red font-medium hover:underline"
          onClick={onClearSearch}
        >
          Clear search
        </button>
      )}
    </div>
  );
};
