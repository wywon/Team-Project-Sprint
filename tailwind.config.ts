import type { Config } from 'tailwindcss';

/**
 * SPOT 디자인 토큰
 * ─────────────────────────────────────────────────────────────
 * 프로토타입(SPOT_v3_프로토타입.html)의 tailwind.config를 그대로 옮긴 것이다.
 * 색 이름은 "역할"로 지어져 있다. blue-500 같은 원색 이름을 직접 쓰지 말고
 * 반드시 아래 팔레트를 쓴다. 그래야 나중에 색을 한 번에 바꿀 수 있다.
 *
 *   brand : 서비스 기본색 (CTA, 선택 상태)
 *   food  : 식당/맛집 계열 강조
 *   ok    : 이용 가능 · 여유 · 성공
 *   busy  : 사용 중 · 만차 · 위험
 *   warn  : 혼잡 · 수동 지정 · 주의
 *   unk   : 확인 중 (센서가 판단을 못한 상태)
 *   off   : 센서 오류 · 비활성
 *   ink   : 텍스트/배경 그레이스케일
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pretendard)', 'Pretendard', '-apple-system', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { 50:'#EEF3FF',100:'#DBE5FF',200:'#BFD1FA',300:'#93B0F5',400:'#5C86EE',500:'#2F63E4',600:'#1F4FD8',700:'#1A3FB0',800:'#12328F',900:'#132B70' },
        food:  { 50:'#FFF3E6',100:'#FFE4C7',200:'#FBC894',300:'#F3A559',400:'#E4770F',500:'#C2560E',600:'#A2450C',700:'#82370A',800:'#602907',900:'#421C05' },
        ok:    { 50:'#E8F7F1',100:'#D0EFE4',200:'#A6E0CB',300:'#6DCBAB',400:'#2FAE85',500:'#0E7A5F',600:'#0B6650',700:'#0A5241',800:'#083F33',900:'#062E26' },
        busy:  { 50:'#FDECEC',100:'#FBD8D8',200:'#F5B4B4',300:'#EC8686',400:'#DC4F52',500:'#B4232A',600:'#991C24',700:'#7C171E',800:'#5F1217',900:'#420C10' },
        warn:  { 50:'#FFF6E4',100:'#FFEBC2',200:'#FBD98C',300:'#F3C155',400:'#DE9A16',500:'#9A6100',600:'#824F00',700:'#6A3F00',800:'#4F2F00',900:'#352000' },
        unk:   { 50:'#F1EEFD',100:'#E4DEFB',200:'#CFC7F2',300:'#AC9EE8',400:'#8271DA',500:'#5B4CC4',600:'#4A3DA6',700:'#3B3186',800:'#2D2565',900:'#1F1A47' },
        off:   { 50:'#F2F4F7',100:'#E7EAEF',200:'#D2D8E0',300:'#B0B9C6',400:'#8792A3',500:'#5A6472',600:'#4A5361',700:'#3B4351',800:'#2B323C',900:'#1B2029' },
        ink:   { 50:'#F7F9FC',100:'#EEF2F8',200:'#E3E7ED',300:'#CBD2DC',400:'#98A2B3',500:'#6B7684',600:'#4C5563',700:'#3D4653',800:'#252C36',900:'#12161C' },
      },
      boxShadow: {
        card:  '0 1px 2px rgba(16,24,40,.05), 0 1px 3px rgba(16,24,40,.06)',
        pop:   '0 12px 32px -8px rgba(16,24,40,.18), 0 4px 10px -4px rgba(16,24,40,.10)',
        sheet: '0 -12px 40px -8px rgba(16,24,40,.22)',
        phone: '0 40px 80px -20px rgba(16,24,40,.45), 0 0 0 1px rgba(16,24,40,.08)',
        mk:    '0 4px 12px -2px rgba(16,24,40,.24)',
      },
      keyframes: {
        sheetUp:  { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn:  { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        popIn:    { '0%': { opacity: '0', transform: 'translateY(8px) scale(.98)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
        toastIn:  { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '.25' } },
        shimmer:  { '0%': { backgroundPosition: '-500px 0' }, '100%': { backgroundPosition: '500px 0' } },
      },
      animation: {
        sheetUp:  'sheetUp .28s cubic-bezier(.32,.72,0,1)',
        fadeIn:   'fadeIn .18s ease-out',
        slideIn:  'slideIn .24s cubic-bezier(.32,.72,0,1)',
        popIn:    'popIn .2s cubic-bezier(.32,.72,0,1)',
        toastIn:  'toastIn .22s cubic-bezier(.32,.72,0,1)',
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
        shimmer:  'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
