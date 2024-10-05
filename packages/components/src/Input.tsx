 

import React, { CSSProperties } from "react"
import { ReactFC } from "./types"; 


export type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?:string
    visible?:boolean
    enable?:boolean
    validate?:boolean | null
    value?:string
    style?:Partial<CSSProperties>
}

export const Input:ReactFC<InputProps> = (props:InputProps)=>{
    const { id=Math.random().toString(36).slice(2), enable = true, validate = true, visible = true, value, style, ...restProps } = props;

    const inputStyle: CSSProperties = {
        border: validate === false ? "1px solid red" : "1px solid #bbb",
        borderRadius: "4px",
        background: enable ? "white" : "gray",
        margin: "4px",
        padding: "8px",
        display: visible ? "block" : "none",
        flexGrow:1,
        ...style,
    };
    const labelStyle: CSSProperties = {
        color: "#666",
        fontSize: "14px",
        marginBottom: "4px",
        flexShrink: 0,
        width: "100px",
    };

    return (
        <div style={{display:"flex",alignItems:"center"}}>
            { props.label ? <label htmlFor={id}  style={labelStyle}>{props.label}</label> : null }
            <input
                id={id}
                style={inputStyle}
                value={value ?? ""}
                readOnly={!enable}
                {...restProps}
            />
        </div>
    );
};
      
 