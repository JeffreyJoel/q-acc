function Card() {
  return (
      <div className="relative cursor-pointer p-4 w-full h-full rounded-xl bg-neutral-800 overflow-hidden shadow-gray-200">
        <div className="relative h-[550px]">
          <img 
            alt="Project Card" 
            loading="lazy" 
            decoding="async" 
            data-nimg="fill" 
            className="rounded-xl" 
            sizes="100vw" 
            src="https://images.unsplash.com/photo-1621478374422-35206faeddfb?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', objectFit: 'cover', color: 'transparent' }} 
          />
          <div className="absolute bg-neutral-800 right-[-2px] top-0 py-[2px] pr-0 pl-2 rounded-tr-xl rounded-bl-2xl">
            <svg className="absolute left-[-18px] top-[-1px]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="#262626">
              <path d="M18 0V18C18 18 17.8462 7.84622 14 4C10.1538 0.153782 0 0 0 0H18Z" fill="#262626"></path>
            </svg>
            <span className="text-white font-redHatText font-semibold">New!</span>
            <svg className="absolute bottom-[-18px] right-[1px]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="#262626">
              <path d="M18 0V18C18 18 17.8462 7.84622 14 4C10.1538 0.153782 0 0 0 0H18Z" fill="#262626"></path>
            </svg>
          </div>
        </div>
        <div className="bg-neutral-800 absolute h-fit bottom-[-120px] hover:bottom-0 no-hover transition-bottom duration-500 ease-in-out left-4 right-4 py-4">
          <div className="absolute bg-neutral-800 left-0 -top-11 w-16 h-16 p-3 rounded-tr-xl rounded-bl-xl">
            <svg className="absolute top-[-18px] left-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="#262626">
              <path d="M0 18V0C0 0 0.153782 10.1538 4 14C7.84622 17.8462 18 18 18 18H0Z" fill="#262626"></path>
            </svg>
            <img 
              alt="Project Icon" 
              loading="lazy" 
              width="50" 
              height="50" 
              decoding="async" 
              data-nimg="1" 

              src="https://images.unsplash.com/photo-1621478374422-35206faeddfb?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              style={{ color: 'transparent' }} 
            />
            <svg className="absolute bottom-5 right-[-18px]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="#262626">
              <path d="M0 18V0C0 0 0.153782 10.1538 4 14C7.84622 17.8462 18 18 18 18H0Z" fill="#262626"></path>
            </svg>
          </div>
          <svg className="absolute -top-[18px] right-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="#262626">
            <path d="M18 18V0C18 0 17.8462 10.1538 14 14C10.1538 17.8462 0 18 0 18H18Z" fill="#262626"></path>
          </svg>
          <div className="relative flex flex-col gap-4 font-redHatText">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white">How To DAO</h2>
            </div>
            <div className="min-h-[100px] text-ellipsis">
              <p className="text-gray-400 overflow-hidden font-redHatText line-clamp-4 leading-6 px-2">
                A new coordination layer for internet-native organizations
                decentralized autonomous organizations — daos — are no longer theory. They are
                real, functioning entities coordinating capital, labor, and community across
                borders. But while the potential is clear, the how remains confusing for many.
                Tha...
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="p-2 flex justify-between items-center bg-neutral-800 rounded-lg">
                <div className="text-gray-200 font-bold text-sm">Received this round</div>
                <div className="flex flex-col">
                  <span className="text-gray-200 font-bold text-lg"> ~ $ 393.83</span>
                  {/* <span className="text-white font-medium text-right">1,628.99 POL</span> */}
                </div>
              </div>
              <hr />
              <div className="p-2 flex justify-between items-center rounded-lg">
                <span className="text-sm text-gray-300 font-bold"> Market Cap</span>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg text-right"> $ 535,349</span>
              
                </div>
              </div>

            </div>
            <div className="w-full flex flex-col gap-2">
              <button className="px-6 py-4 rounded-full text-sm font-bold items-center flex gap-2 text-white bg-giv-500 w-full justify-center opacity-80 hover:opacity-100">
                Buy Token
              </button>
              <button className="px-6 py-4 text-black rounded-full text-sm font-bold flex gap-2 text-giv-500 bg-peach-400 w-full justify-center items-center">
                Review Project
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Card;

