"use client"

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useEffect, useState } from "react"

export const Modals = () => {
    const [mounted, setMouted] = useState(false);

    useEffect(() => {
        setMouted(true);
    }, [])

    if (!mounted) {
        return null;
    }

    return (
        <>
            <CreateWorkspaceModal />
        </>
    )
}