type props = {color: string, width:string, height:string}

export function Spinner({color, width, height}:props) {
    return <svg className={`spinner text-[${color}] w-${width} h-${height} `} viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50" stroke="currentColor"></circle>
    </svg>
}