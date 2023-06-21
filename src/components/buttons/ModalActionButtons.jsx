import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@radix-ui/react-separator"
import { cn } from "../../lib/utils.js";

// type actions: [{
//    title: string, //what we display on the button
//    icon: ReactComponent, //the icon we display on the button
//    action: function //what we do when the button is pressed
//    className: string //the class name we apply to the option
// }]
// React component that renders the Modal action buttons with a dropdown
export function ModalActionButtons({
    actions
}) {
    const [showDropdown, setShowDropdown] = useState(false);


    return (<div
        className="ecfw-flex ecfw-relative"
    >
        <button id="dropdownDefaultButton"
            data-testid="dropdownDefaultButton"
            onClick={() => actions[0].action(null, null, true)}
            data-dropdown-toggle="dropdown"
            className="ecfw-pr-10 ecfw-flex ecfw-h-10 ecfw-rounded-l-md ecfw-py-2 ecfw-px-4 ecfw-bg-primary ecfw-text-primary-foreground hover:ecfw-bg-primary/90"
            type="button">
            {actions[0].icon}
            {actions[0].title}
        </button>
        <button
            onClick={() => setShowDropdown(!showDropdown)}
            data-testid="dropdownButton"
            className="ecfw-flex ecfw-h-10 ecfw-rounded-r-md ecfw-py-2 ecfw-border-l-2 ecfw-border-slate-200 ecfw-px-3 ecfw-bg-primary ecfw-text-primary-foreground hover:ecfw-bg-primary/90">
            {showDropdown ?
                <ChevronUp className="mr-2 h-4 w-4" />
                :
                <ChevronDown className="mr-2 h-4 w-4" />}
        </button>
        {showDropdown && (
            <div id="dropdown"
                className="ecfw-absolute ecfw-top-10 ecfw-w-full"
            >
                <div
                    className="ecfw-border-slate-100 ecfw-z-50 ecfw-min-w-[8rem] ecfw-overflow-hidden ecfw-rounded-md ecfw-border ecfw-bg-popover ecfw-p-1 ecfw-text-popover-foreground ecfw-shadow-md ecfw-animate-in data-[side=bottom]:ecfw-slide-in-from-top-2 data-[side=left]:ecfw-slide-in-from-right-2 data-[side=right]:ecfw-slide-in-from-left-2 data-[side=top]:ecfw-slide-in-from-bottom-2"
                >
                    {actions.map((action, index) => {
                        if (index === 0) {
                            return null;
                        }
                        if (index === 1) {
                            return (
                                <div
                                    className={cn(
                                        action.className,
                                        "ecfw-cursor-pointer hover:ecfw-bg-secondary/90 ecfw-flex ecfw-relative ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-2 ecfw-py-2 ecfw-outline-none ecfw-transition-colors focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[disabled]:ecfw-pointer-events-none data-[disabled]:ecfw-opacity-50"
                                    )}
                                    onClick={action.action}
                                >
                                    {action.icon}
                                    {action.title}
                                </div>
                            );
                        }
                        else {
                            return (
                                <>
                                    <Separator
                                        className="ecfw-shrink-0 ecfw-border-slate-100"
                                        style={{
                                            borderWidth: '0 0 0.1px 0',
                                        }}
                                    />
                                    <div
                                        className={cn(
                                            action.className,
                                            "ecfw-cursor-pointer hover:ecfw-bg-secondary/90 ecfw-flex ecfw-relative ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-2 ecfw-py-2 ecfw-outline-none ecfw-transition-colors focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[disabled]:ecfw-pointer-events-none data-[disabled]:ecfw-opacity-50"
                                        )}
                                        onClick={action.action}
                                    >
                                        {action.icon}
                                        {action.title}
                                    </div>
                                </>
                            );
                        }
                    }
                    )}
                </div>
            </div>
        )}
    </div>);
}