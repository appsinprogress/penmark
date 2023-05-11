"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "ecfw-flex ecfw-h-10 ecfw-items-center ecfw-space-x-1 ecfw-bg-background ecfw-p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "ecfw-flex ecfw-cursor-pointer ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-3 ecfw-py-1.5 ecfw-text-sm ecfw-font-medium ecfw-outline-none focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[state=open]:ecfw-bg-accent data-[state=open]:ecfw-text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "ecfw-flex ecfw-cursor-pointer ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-2 ecfw-py-1.5 ecfw-text-sm ecfw-outline-none focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[state=open]:ecfw-bg-accent data-[state=open]:ecfw-text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ecfw-ml-auto ecfw-h-4 ecfw-w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "ecfw-z-50 ecfw-min-w-[8rem] ecfw-overflow-hidden ecfw-rounded-md ecfw-border ecfw-bg-popover ecfw-p-1 ecfw-text-popover-foreground ecfw-shadow-md ecfw-animate-in data-[side=bottom]:ecfw-slide-in-from-top-1 data-[side=left]:ecfw-slide-in-from-right-1 data-[side=right]:ecfw-slide-in-from-left-1 data-[side=top]:ecfw-slide-in-from-bottom-1",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "ecfw-z-50 ecfw-min-w-[12rem] ecfw-overflow-hidden ecfw-rounded-md ecfw-border ecfw-bg-popover ecfw-p-1 ecfw-text-popover-foreground ecfw-shadow-md ecfw-animate-in ecfw-slide-in-from-top-1",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "ecfw-relative ecfw-flex ecfw-cursor-pointer ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-2 ecfw-py-1.5 ecfw-text-sm ecfw-outline-none focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[disabled]:ecfw-pointer-events-none data-[disabled]:ecfw-opacity-50",
      inset && "ecfw-pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "ecfw-relative ecfw-flex ecfw-cursor-pointer ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-py-1.5 ecfw-pl-8 ecfw-pr-2 ecfw-text-sm ecfw-outline-none focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[disabled]:ecfw-pointer-events-none data-[disabled]:ecfw-opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="ecfw-absolute ecfw-left-2 ecfw-flex ecfw-h-3.5 ecfw-w-3.5 ecfw-items-center ecfw-justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="ecfw-h-4 ecfw-w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "ecfw-relative ecfw-flex ecfw-cursor-pointer ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-py-1.5 ecfw-pl-8 ecfw-pr-2 ecfw-text-sm ecfw-outline-none focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[disabled]:ecfw-pointer-events-none data-[disabled]:ecfw-opacity-50",
      className
    )}
    {...props}
  >
    <span className="ecfw-absolute ecfw-left-2 ecfw-flex ecfw-h-3.5 ecfw-w-3.5 ecfw-items-center ecfw-justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="ecfw-h-2 ecfw-w-2 ecfw-fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "ecfw-px-2 ecfw-py-1.5 ecfw-text-sm ecfw-font-semibold",
      inset && "ecfw-pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-ecfw-mx-1 ecfw-my-1 ecfw-h-px ecfw-bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "ecfw-ml-auto ecfw-text-xs ecfw-tracking-widest ecfw-text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
