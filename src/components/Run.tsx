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
            <button className="tab tab-lifted tab-active">Preview</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  flex min-h-[6rem] w-100 flex-wrap items-center justify-center gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <button className="btn btn-primary">Hello world ?</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Run;
