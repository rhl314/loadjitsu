import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import TopNav from "../frontend_util/react/components/TopNav";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const Execution = () => {
  return (
    <>
      <div className="bg-primary py-8">
        <div className="app_container mx-auto">
          <div className="mt-10">
            <LineChart width={960} height={480} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </div>
          <hr className="my-8" />
          <div>
            <div className="min-h-[6rem] border-t-0 border-neutral-700">
              <div className="grid grid-cols-12">
                <div className="col-span-3 items-center content-center mx-auto">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="red"
                      className="w-[60px] mx-auto mt-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 mb-8">
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Abort test</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Success</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Timeouts</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">
                      Errors and Exceptions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="min-h-[6rem] border-t-0 border-neutral-700">
              <div className="grid grid-cols-12">
                <div className="col-span-3 items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 mb-8">
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">
                      Avg response time (ms)
                    </p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">
                      Max response time (ms)
                    </p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Avg latency (ms)</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Max latency (ms)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="app_container mx-auto mt-10">
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Past runs</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Execution;
