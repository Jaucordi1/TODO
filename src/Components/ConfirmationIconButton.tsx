import React, { useState } from "react"
import { Button, Typography, ButtonProps } from "@material-ui/core"

export interface ConfirmationIconButtonProps {
    buttonProps: ButtonProps
    icon: React.ReactNode
    children: React.ReactNode
    onConfirm: (ev: React.MouseEvent) => void
}
export default function ConfirmationIconButton(props: ConfirmationIconButtonProps) {
    const [confirmed, setConfirmed] = useState(false)
    const handleClick = (ev: React.MouseEvent) => {
        ev.preventDefault()

        if (confirmed) {
            props.onConfirm(ev)
            setConfirmed(false)
        } else
            setConfirmed(true)
    }
    const handleMouseLeave = (ev: React.MouseEvent) => {
        if (confirmed)
            setConfirmed(false)
    }
    return (
        <Button {...props.buttonProps} onClick={handleClick} onMouseLeave={handleMouseLeave}>
            {props.icon}
            {confirmed && <Typography>{props.children}</Typography>}
        </Button>
    )
}