const tagStyles: Record<string, string> = {
    Beginner: "bg-amber-300",
    Intermediate: "bg-lime-300",
    Advanced: "bg-blue-300",
};

interface TagProps {
    name: keyof typeof tagStyles; // Restrict name to predefined tags
}

const FilterTag: React.FC<TagProps> = ({ name }) => {
    return (
        <span
            className={`px-3 py-1 rounded-full text-white text-sm font-medium ${tagStyles[name]}`}
        >
            {name}
        </span>
    );
};


export default FilterTag;
