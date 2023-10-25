const Run = () => {
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Loadjitsu</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a className="bg-base-200">Unlicensed</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="app_container mx-auto">
        <article className="prose prose-lg my-4">
          <h2>Untitled test</h2>
        </article>
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Settings</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="grid grid-cols-3 gap-2 flex items-center h-full">
                <div className="text-center">
                  <div className="text-[42px]">100</div>
                  <div>Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-[42px]">100</div>
                  <div>Seconds</div>
                </div>
                <div className="text-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-[60px] mx-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>Start Test</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4"></div>
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Settings</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="join w-full">
                <select className="select select-bordered join-item w-2/12">
                  <option selected>GET</option>
                  <option>Sci-fi</option>
                  <option>Drama</option>
                  <option>Action</option>
                </select>
                <div className="w-10/12">
                  <div>
                    <input
                      className="input input-bordered join-item w-full"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
              <div className="my-4"></div>
              <div className="join w-full">
                <div className="indicator w-2/12">
                  <button className="btn join-item w-full border">
                    Timeout (ms)
                  </button>
                </div>
                <div className="w-3/12">
                  <div>
                    <input
                      className="input input-bordered join-item w-full"
                      placeholder="Search"
                    />
                  </div>
                </div>
                <div className="w-1/12"></div>
                <div className="indicator w-6/12">
                  <button className="btn join-item w-full">
                    Test connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Run;
