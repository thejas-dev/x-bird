import Image from 'next/image'
import Main from '../components/Main';
import {useRouter} from 'next/navigation';

export default function Home() {
  return (
    <div className="h-screen w-full">
      <Main/>
    </div>
  )
}
