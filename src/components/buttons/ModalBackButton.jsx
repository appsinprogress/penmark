import React from 'react';
import { ChevronLeft } from "lucide-react";

export function BackButton({
    setShowModalBoolean,
    originalFileContentWithImagesReplacedWithBlobs,
    syncContentAcrossProsemirrorAndTextarea
}) {
    const handleBackPress = () => {
        const contentToSave = syncContentAcrossProsemirrorAndTextarea();

        if (originalFileContentWithImagesReplacedWithBlobs !== contentToSave) {
            if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
                setShowModalBoolean(false);
            }
        }
        else {
            setShowModalBoolean(false);
        }
    }

    return <button
        className="ecfw-text-bg-primary hover:ecfw-text-bg-primary/90 ecfw-rounded-md ecfw-py-2 ecfw-h-10 "
        onClick={() => handleBackPress()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
    </button>
}