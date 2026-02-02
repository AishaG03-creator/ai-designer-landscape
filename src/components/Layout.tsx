import React from 'react';
import { ViewMode } from '../../types';
import { LayoutGrid, List, Search, FolderPlus, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddCategory: () => void;
}

const LogoIcon = ({ width = 55, className = "" }: { width?: number, className?: string }) => {
  const height = width * (120 / 166);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 166 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_g_971_3079)">
        <path d="M115.961 25.9315C125.561 27.4773 132.042 30.5146 137.276 35.9655C142.619 41.552 145.303 46.8945 148.476 58.3658C150.185 64.4676 150.537 66.7185 150.564 71.1931C150.564 75.5321 150.293 77.7017 149.29 80.9017C148.042 84.834 146.903 86.7052 143.866 89.8239C139.88 93.9459 135.052 96.0612 123.554 98.6646C120.517 99.3697 115.554 100.238 112.706 100.59C111.513 100.753 108.449 101.187 105.927 101.539C86.0755 104.441 74.6584 105.227 66.1972 104.278C62.9158 103.899 58.3327 102.922 56.8412 102.271C56.5429 102.163 55.5666 101.756 54.6716 101.431C49.1665 99.3426 44.719 94.5426 42.6037 88.4137C40.8681 83.3153 40.1901 78.7322 40.1901 71.8711C40.163 61.5387 42.1969 51.4776 45.3427 46.2436C48.7597 40.5215 54.0208 35.9113 60.6107 32.8197C66.9294 29.8366 72.3261 28.7247 89.7908 26.6908C97.2756 25.823 99.2824 25.6874 105.927 25.6061C111.594 25.5518 114.144 25.6332 115.961 25.9315Z" fill="url(#paint0_linear_971_3079)" />
      </g>
      <path d="M58.811 49.9835C56.9252 50.1717 55.549 51.853 55.7372 53.7388L56.2567 58.9456C57.0093 66.4888 63.7344 71.9936 71.2776 71.2409L118.549 66.5243C126.092 65.7717 131.597 59.0466 130.845 51.5034L130.325 46.2966C130.137 44.4108 128.456 43.0346 126.57 43.2227L58.811 49.9835Z" fill="url(#paint1_linear_971_3079)" />
      <g filter="url(#filter1_g_971_3079)">
        <path d="M153.923 38.2135C158.642 40.5187 162.276 46.1052 163.55 53.0205C163.713 53.9154 164.093 55.6239 164.364 56.8172C165.367 61.1562 165.53 63.0817 165.069 65.9563C164.825 67.3936 164.445 69.1563 164.201 69.8343C163.713 71.2987 161.896 74.3632 161.516 74.4174C161.354 74.4445 161.164 73.4683 161.055 72.275C160.513 66.2275 158.289 55.9494 156.038 48.9527C154.709 44.8306 153.516 41.5221 153.218 41.0882C152.811 40.5187 151.672 37.4271 151.835 37.3457C151.943 37.3186 152.865 37.6983 153.923 38.2135Z" fill="url(#paint2_linear_971_3079)" />
      </g>
      <g filter="url(#filter2_g_971_3079)">
        <path d="M16.299 50.0598C18.8482 51.1716 22.0211 55.7276 23.5126 60.4192C26.2516 68.9888 25.6279 82.8738 22.238 89.5179C21.4787 91.0366 19.7431 92.8535 18.5227 93.4502C17.221 94.0739 13.4515 94.0739 11.5803 93.4502C9.89889 92.8807 6.31918 90.3857 5.04459 88.8671C4.01406 87.6738 1.98014 83.7416 1.27504 81.5449C0.352997 78.7245 0.000450134 75.6059 0.000450134 70.2363C0.000450134 65.1379 0.217402 63.3481 1.08521 60.5006C1.54623 58.9819 3.22761 55.8361 4.31237 54.3717C5.74968 52.4734 8.65141 50.331 10.3599 49.9513C12.2582 49.5174 15.16 49.5716 16.299 50.0598Z" fill="url(#paint3_linear_971_3079)" />
      </g>
      <path d="M95.8896 0.435768C102.995 1.05951 109.341 2.38834 115.144 4.53074C118.046 5.58838 124.392 8.73418 127.321 10.5512C135.727 15.8122 143.077 23.2157 147.687 31.1074C148.555 32.5718 149.612 34.3616 150.019 35.0667C150.724 36.2329 153.409 42.3075 154.277 44.6126C155.958 49.1957 157.585 55.1619 159.077 62.24C160.324 68.2604 160.65 71.0537 160.677 75.9351C160.704 80.8979 160.053 84.4776 158.372 88.6268C156.582 93.0472 155.09 95.2709 151.646 98.7422C146.548 103.868 141.477 106.769 132.907 109.427C128.378 110.864 120.08 112.763 114.602 113.631C112.812 113.929 109.937 114.39 108.229 114.715C101.476 115.909 83.9302 117.888 72.4588 118.783C66.8723 119.19 52.8789 119.136 48.811 118.648C38.8041 117.481 32.6752 115.692 26.6006 112.193C20.8242 108.858 15.5903 103.135 12.336 96.5455C11.7122 95.2709 11.2783 94.1591 11.3868 94.0506C11.4953 93.9421 11.9834 93.9692 12.4987 94.1048C13.9089 94.5116 16.2682 94.4303 17.9496 93.9421C19.0072 93.6167 19.7395 93.1828 20.6073 92.2878C21.909 90.9048 23.6717 87.4878 24.2955 85.0471C25.5701 80.0301 25.9768 70.7011 25.1362 65.9011C23.97 59.3654 22.0175 54.8636 18.8988 51.5822C17.136 49.711 16.0513 49.2771 13.1767 49.3042C11.8478 49.3042 10.6546 49.25 10.5461 49.1957C10.4377 49.1144 10.7902 47.8127 11.3055 46.294C15.753 33.5481 23.0209 23.3242 33.0278 15.8394C37.4482 12.5308 39.455 11.2562 43.9567 8.95113C48.9466 6.37483 55.7963 4.38519 59.2035 3.4155C62.6107 2.44582 72.8323 0.985596 76.2395 0.498856C79.6467 0.0121155 84.5647 0.000701904 88.8948 0.000701904C93.2248 0.000701904 88.0089 0.0240173 88.8948 0.000701904C89.7806 -0.0226059 95.293 0.408653 95.8896 0.435768ZM92.6353 26.1446C89.354 26.5514 85.0149 27.0395 83.0081 27.2565C66.4655 29.1006 57.5162 32.4904 50.3297 39.677C47.4551 42.5516 45.2584 45.5347 43.9296 48.3822C42.872 50.6873 41.1092 57.7653 40.594 61.8332C39.3736 71.6232 39.8618 80.4097 41.9771 87.1895C44.2008 94.2404 48.8653 99.5015 54.9399 101.779C65.1367 105.576 76.147 105.793 100.093 102.62C104.052 102.105 107.876 101.563 108.636 101.427C109.368 101.291 111.076 101.047 112.432 100.857C118.181 100.125 127.158 98.2269 132.365 96.6269C139.416 94.4574 144.812 90.4438 147.768 85.1555C148.853 83.203 150.155 79.1351 150.534 76.5588C150.887 73.9825 150.887 68.1791 150.534 65.9011C150.128 63.4603 148.012 55.6772 146.575 51.4195C142.968 40.816 137.273 33.8193 128.704 29.4802C124.961 27.609 120.188 26.2531 114.602 25.5209C111.049 25.0327 99.2253 25.3853 92.6353 26.1446Z" fill="url(#paint4_linear_971_3079)" />
      <ellipse cx="6.81438" cy="13.6288" rx="6.81438" ry="13.6288" transform="matrix(-1 0 0 1 14.6719 58.4102)" fill="url(#paint5_linear_971_3079)" />
      <defs>
        <filter id="filter0_g_971_3079" x="-38.2774" y="-52.877" width="267.309" height="236.004" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.87425500154495239 0.87425500154495239" numOctaves="3" seed="8869" result="displacementX" />
          <feTurbulence type="fractalNoise" baseFrequency="0.87425500154495239 0.87425500154495239" numOctaves="3" seed="8870" result="displacementY" />
          <feColorMatrix in="displacementX" type="matrix" values="0 0 0 1 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="displacementXRed" />
          <feColorMatrix in="displacementY" type="matrix" values="0 0 0 0 0  0 0 0 1 0  0 0 0 0 0  0 0 0 0 1" />
          <feComposite in="displacementXRed" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          <feDisplacementMap in="shape" scale="156.93360900878906" xChannelSelector="R" yChannelSelector="G" width="100%" height="100%" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feComponentTransfer result="sourceDisplacedAlpha">
            <feFuncA type="gamma" exponent="0.2" />
          </feComponentTransfer>
          <feColorMatrix in="shape" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feComponentTransfer result="inputSourceAlpha">
            <feFuncA type="gamma" exponent="0.2" />
          </feComponentTransfer>
          <feComposite in="sourceDisplacedAlpha" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="displacementAlphasMultiplied" />
          <feComposite in="displacementAlphasMultiplied" operator="arithmetic" k1="0" k2="0" k3="-0.5" k4="0.5" result="centeringAdjustment" />
          <feComposite in="displacementX" in2="displacementAlphasMultiplied" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
          <feComposite in="centeringAdjustment" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          <feColorMatrix type="matrix" values="0 0 0 1 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="displacementXFinal" />
          <feComposite in="displacementY" in2="displacementAlphasMultiplied" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
          <feComposite in="centeringAdjustment" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 1 0  0 0 0 0 0  0 0 0 0 1" result="displacementYFinal" />
          <feComposite in="displacementXFinal" in2="displacementYFinal" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          <feComposite in2="displacementAlphasMultiplied" operator="in" result="displacementMap" />
          <feFlood floodColor="rgb(127, 127, 127)" floodOpacity="1" />
          <feComposite in2="displacementAlphasMultiplied" operator="out" />
          <feComposite in2="displacementMap" operator="over" result="displacementMapWithBg" />
          <feDisplacementMap in="shape" scale="156.93360900878906" xChannelSelector="R" yChannelSelector="G" width="100%" height="100%" result="displacedImage" />
          <feColorMatrix in="shape" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 127 0" result="imageOpaque" />
          <feDisplacementMap in="imageOpaque" in2="displacementMapWithBg" scale="156.93360900878906" xChannelSelector="R" yChannelSelector="G" width="100%" height="100%" result="displacedImageOpaque" />
          <feColorMatrix in="displacedImage" type="matrix" values="0 0 0 1 0  0 0 0 0 0  0 0 0 0 0  0 0 0 127 0" result="displacedImageRed" />
          <feColorMatrix in="shape" type="matrix" values="0 0 0 1 0  0 0 0 0 0  0 0 0 0 0  0 0 0 127 0" />
          <feComposite in="displacedImageRed" operator="atop" result="transparencyRedMap" />
          <feColorMatrix in="transparencyRedMap" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="transparencyAlphaMap" />
          <feComposite in="displacedImageOpaque" in2="imageOpaque" operator="over" />
          <feComposite in2="transparencyAlphaMap" operator="in" result="effect1_texture_971_3079" />
        </filter>
        <linearGradient id="paint0_linear_971_3079" x1="26.8688" y1="100.409" x2="36.4277" y2="21.3272" gradientUnits="userSpaceOnUse">
          <stop stopColor="#170A26" />
          <stop offset="1" stopColor="#BAC3CD" />
        </linearGradient>
        <linearGradient id="paint1_linear_971_3079" x1="-6.94185" y1="67.8114" x2="126.739" y2="54.4731" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B7B8CD" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient id="paint2_linear_971_3079" x1="150.19" y1="72.4248" x2="164.544" y2="41.4571" gradientUnits="userSpaceOnUse">
          <stop stopColor="#170A26" />
          <stop offset="1" stopColor="#BAC3CD" />
        </linearGradient>
        <linearGradient id="paint3_linear_971_3079" x1="-3.04431" y1="91.5384" x2="9.18018" y2="50.2426" gradientUnits="userSpaceOnUse">
          <stop stopColor="#170A26" />
          <stop offset="1" stopColor="#BAC3CD" />
        </linearGradient>
        <linearGradient id="paint4_linear_971_3079" x1="85.4914" y1="220.016" x2="85.4914" y2="7.30945" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B7B8CD" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient id="paint5_linear_971_3079" x1="6.82444" y1="-23.1878" x2="6.82443" y2="25.6647" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B8B8B" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  onAddCategory
}) => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#333333] to-[#3E3E3E] text-[#F7F5F2]">
      {/* Top Header */}
      <header className="flex-none px-3 sm:px-6 py-4 sm:py-6 flex items-center justify-between z-10 relative border-b border-white/5 bg-[#333333]/50 backdrop-blur-sm">
        <div
          className="flex items-center gap-2 sm:gap-4 cursor-pointer group"
          onClick={() => setViewMode('grid')}
        >
          <div className="transition-transform duration-300 group-hover:scale-105">
            <LogoIcon width={40} className="sm:w-[55px]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-none group-hover:text-[#0061FE] transition-colors">AI Landscape</h1>
              <span className="px-1.5 sm:px-2 py-0.5 bg-[#e0e7ff]/10 text-[#6366f1] text-[10px] sm:text-xs font-bold rounded-full">v1.0</span>
            </div>
            <p className="text-[9px] sm:text-xs font-bold text-white/40 tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2 ml-0.5">FOR DESIGNERS</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 flex-1 max-w-2xl justify-end">
          {/* Search Bar */}
          <div className="relative w-full max-w-sm hidden sm:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#0061FE] transition-colors" size={18} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search tools & categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#262626] border border-white/10 text-white pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0061FE] focus:border-transparent transition-all shadow-sm placeholder-white/30"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Add Category Button */}
            <button
              onClick={onAddCategory}
              className="bg-[#262626] border border-white/10 hover:bg-white/5 text-white p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center"
              title="Add New Category"
            >
              <FolderPlus size={20} strokeWidth={2} />
            </button>

            {/* View Toggles */}
            <div className="flex bg-[#262626] p-1.5 rounded-xl border border-white/10 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'grid' || viewMode === 'detail' ? 'bg-white text-[#1E1919] shadow-md' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
              >
                <LayoutGrid size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('tool-index')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'tool-index' ? 'bg-white text-[#1E1919] shadow-md' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
              >
                <List size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Index</span>
              </button>
              <button
                onClick={() => setViewMode('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'admin' ? 'bg-white text-[#1E1919] shadow-md' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                title="Admin Review"
              >
                <Shield size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="w-full h-full p-2">
          {children}
        </div>
      </main>
    </div>
  );
};