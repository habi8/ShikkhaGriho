export function FloatingElements() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-[#F8FAFC]">
            {/* Dot Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#2E8B57_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.07]"></div>

            {/* Floating Sparkles and Shapes */}
            {/* Top Left Area */}
            <div className="absolute top-[8%] left-[10%] text-[#2E8B57] opacity-20 text-3xl animate-pulse">✦</div>
            <div className="absolute top-[18%] left-[4%] text-[#2E8B57] opacity-20 text-xl rotate-45">■</div>

            {/* Center Left Area */}
            <div className="absolute top-[45%] left-[8%] text-[#2E8B57] opacity-30 text-5xl">✧</div>
            <div className="absolute top-[60%] left-[3%] w-4 h-4 rounded-full border-2 border-[#2E8B57] opacity-20"></div>

            {/* Bottom Left Area */}
            <div className="absolute bottom-[10%] left-[12%] text-[#2E8B57] opacity-20 text-2xl rotate-12">▲</div>

            {/* Top Right Area */}
            <div className="absolute top-[12%] right-[15%] text-[#2E8B57] opacity-30 text-4xl animate-pulse">✦</div>
            <div className="absolute top-[25%] right-[6%] w-5 h-5 rounded-full border-[3px] border-[#2E8B57] opacity-20"></div>

            {/* Center Right Area */}
            <div className="absolute top-[50%] right-[10%] text-[#2E8B57] opacity-20 text-3xl -rotate-12">▲</div>
            <div className="absolute top-[70%] right-[5%] text-[#2E8B57] opacity-20 text-5xl rotate-45">✧</div>

            {/* Bottom Right Area */}
            <div className="absolute bottom-[15%] right-[18%] text-[#2E8B57] opacity-20 text-2xl">■</div>
            <div className="absolute bottom-[5%] right-[8%] text-[#2E8B57] opacity-30 text-3xl animate-pulse">✦</div>
        </div>
    )
}
