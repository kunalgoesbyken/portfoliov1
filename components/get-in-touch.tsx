import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function GetInTouch() {
    return (
        <div className="w-full mt-14 md:mt-8 mb-10 relative z-10">
            <div className="flex flex-col items-start space-y-4 md:space-y-6">
                <div className="flex w-full justify-between items-center">
                    <h1 className="text-3xl md:text-3xl font-bold font-custom tracking-tight text-neutral-900 dark:text-neutral-50">
                        <span className="link--elara">Get in touch</span>
                    </h1>
                </div>

                <p role="status" className="font-custom2 text-neutral-700 dark:text-neutral-300 px-4 py-1 text-sm inline-block bg-neutral-100 dark:bg-neutral-900 border-dashed border-neutral-300 dark:border-neutral-700 border">
                    Hi there, I'm currently open to meaningful work.
                </p>

                <div className="w-full max-w-2xl flex gap-4 max-md:[&>a]:w-full max-md:[&>a]:min-h-12 max-md:[&>a]:justify-center">
                    <Link
                        href="/contact"
                        className="btn-solid group px-6 py-2.5"
                    >
                        Send Enquiry
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 opacity-70 group-hover:opacity-100" />
                    </Link>


                </div>
            </div>

            {/* Decorative Grid Pattern */}
            <div
                className="absolute -bottom-12 -right-2 md:-bottom-20 md:-right-14 w-80 h-40 -z-10 pointer-events-none opacity-60 dark:opacity-40"
                style={{
                    maskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)'
                }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] bg-right-bottom inset-shadow-elevated"></div>
            </div>
        </div>
    );
}
