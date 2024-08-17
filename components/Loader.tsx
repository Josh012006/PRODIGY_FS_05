import ClipLoader from "react-spinners/ClipLoader";

export default function Loader({color, size} : {color : string, size: number}) {
    return (
        <div className="flex">
            <ClipLoader size={size} color={color} cssOverride={{ margin: 'auto' }} />
        </div>
    );
}