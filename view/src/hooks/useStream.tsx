import { useContext } from "react";
import { StreamContext } from "../context/StreamContext";

function useStream(){
    const context = useContext(StreamContext)
    return context
}

export default useStream