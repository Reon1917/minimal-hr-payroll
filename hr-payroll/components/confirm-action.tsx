"use client";
export function ConfirmAction({ action, label, confirmText, danger=false }: { action:()=>void|Promise<void>; label:string; confirmText:string; danger?:boolean }) { return <form action={action} onSubmit={(e)=>{if(!confirm(confirmText))e.preventDefault()}}><button className={`button button-small ${danger ? "button-danger" : "button-secondary"}`}>{label}</button></form>; }
