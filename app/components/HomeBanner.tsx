import Image from 'next/image';

const HomeBanner = () => {
    return (
        <div className="relative bg-white mb-8 overflow-hidden">
            <div className="mx-auto p-16 flex flex-col md:flex-row items-center justify-evenly " style={{background:'#ecf1f4'}}>
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Mùa đông đến giảm giá cực sốc</h1>
                    <p className="text-lg md:text-xl text-gray-800 mb-2">Tận hưởng giảm giá tại cửa hàng</p>
                    <p className="text-2xl md:text-3xl text-yellow-400 font-bold">Tặng phiếu giảm giá 35%</p>
                </div>
                <div className="w-full relative aspect-video overflow-hidden">
                <Image src="/banner-image.png"  
                fill 
                alt="Banner Image" 
                className="object-contain"/>
                </div>
            </div>
        </div>
    );
}

export default HomeBanner;
