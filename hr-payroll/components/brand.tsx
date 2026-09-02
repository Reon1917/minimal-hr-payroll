import Image from "next/image";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <div className={`product-brand ${className}`.trim()} aria-label="Flash HR">
      <Image
        className="product-brand-mark"
        src="/brand/flash-hr-mark.png"
        alt=""
        width={40}
        height={40}
        priority
      />
      <span>Flash <strong>HR</strong></span>
    </div>
  );
}
