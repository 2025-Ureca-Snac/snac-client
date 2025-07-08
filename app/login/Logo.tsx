import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex justify-center items-center bg-black w-1/2 h-screen">
      <Image src="/logo.png" alt="logo" width={300} height={300} />
    </div>
  );
}
