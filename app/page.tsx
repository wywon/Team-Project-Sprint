import { redirect } from 'next/navigation';

/** 루트로 들어오면 손님 앱 첫 화면으로 보낸다 */
export default function Home() {
  redirect('/explore');
}
