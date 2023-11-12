import { invoke } from "@tauri-apps/api/tauri";
import TopNav from "../frontend_util/react/components/TopNav";
import { IRunDocumentFile } from "../types/common";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

const Home = () => {
  const navigate = useNavigate();
  const [recentRuns, setRecentRuns] = useState<IRunDocumentFile[]>([]);
  async function getRecentRuns() {
    const response = (await invoke("getRecentRuns")) as IRunDocumentFile[];
    setRecentRuns(response);
  }

  useEffect(() => {
    getRecentRuns();
  }, []);
  const openNewLoadTest = async () => {
    const temporaryDocumentPath = await invoke("getTemporaryDocumentPath");
    navigate(`/runs/api/${temporaryDocumentPath}`);
  };
  return (
    <div>
      <TopNav container="container-fluid" />
      <div className="app_container mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <article className="prose prose-lg my-4">
                <h2>Recent load tests</h2>
              </article>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  openNewLoadTest();
                }}
              >
                New load test
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Test title
                        </th>

                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Saved at
                        </th>

                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-center"
                        >
                          <span>Open</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {recentRuns
                        // @ts-ignore
                        .sort((a, b) => {
                          return (
                            new Date(b.saved_at as string) >
                            new Date(a.saved_at as string)
                          );
                        })
                        .map((runDocumentFile) => (
                          <tr key={runDocumentFile.id as string}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {runDocumentFile.title}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {dayjs(
                                new Date(runDocumentFile.saved_at as string)
                              ).format("DD MMMM YYYY HH:mm:ss A")}
                            </td>

                            <td className="cursor-pointer relative whitespace-nowrap py-4 pl-3 pr-4  text-sm font-medium sm:pr-6 text-center items-center">
                              <div
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => {
                                  const encodedPath = btoa(
                                    unescape(
                                      encodeURIComponent(
                                        runDocumentFile.path.toString()
                                      )
                                    )
                                  );
                                  navigate(`/runs/api/${encodedPath}`);
                                }}
                              >
                                Open
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
