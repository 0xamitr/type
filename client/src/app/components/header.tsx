"use client"

import Image from "next/image"
import icon from "../../../public/typing-icon.svg"
import { useEffect, useState } from "react"

export function Header(){
    return(
        <header>
            <div className="left">
                <Image className="logo" src={icon} alt="keyboard logo"></Image>
                <h2>TYPE</h2>
            </div>
            <div className="right">
                
            </div>
        </header>
    )
}