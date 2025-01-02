const tagStyles: Record<string, string> = {
    open: "bg-rose-300",
    beginner: "bg-amber-300",
    intermediate: "bg-lime-300",
    advanced: "bg-blue-300",
};

interface TagProps {
    name: keyof typeof tagStyles; // Restrict name to predefined tags
}

const FilterTag: React.FC<TagProps> = ({ name }) => {
    const displayName = `${name[0].toLocaleUpperCase()}${name.slice(1)}`; // capitalize
    return (
        <span
            className={`px-3 py-1 rounded-full text-white text-sm font-medium ${tagStyles[name]}`}
        >
            {displayName}
        </span>
    );
};


export default FilterTag;
