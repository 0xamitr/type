export default function Progress(props: any) {
    return (
        <div>
            <div style={{ width: "100%", height: "20px", backgroundColor: "#e0e0e0", borderRadius: "5px" }}>
                <div style={{ width: `${(props.text_length / props.total_length) * 100}%`, height: "100%", backgroundColor: "#76c7c0", borderRadius: "5px" }}></div>
            </div>
            <p>{props.text_length}/{props.total_length}</p>
        </div>
    )
}