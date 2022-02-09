import { NextApiHandler } from "next";
import EnvSettings from "types/EnvSettings";

const handler: NextApiHandler = (_req, res) => {
  const envSettings: EnvSettings = {
    buildId: process.env.NEXT_PUBLIC_BUILD_ID,
    backendUrl: process.env.BACKEND_URL
  };

  /**
   * If repeated requests are within 60 seconds the cache will be used.
   * If the requests are between 60 and 120 seconds the cache value is still used, but it is then updated following that.
   *  - If a request is then done again but this time within 60 seconds the new value in the cache is used.
   * If the seconds are more than 120 seconds apart, the api request will have to be waited on.
   */
  res.setHeader("Cache-Control", "public, maxage=60, stale-while-revalidate=120");

  res.status(200).json(envSettings);
};

export default handler;
