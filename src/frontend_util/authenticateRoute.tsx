import router from "next/router";
import React, { useEffect, useState } from "react";
import { ApiClient } from "../api_client/api_client";
const authenticatedRoute = (Component: React.FunctionComponent) => {
    const Wrapper = () => {
        const [loading, setLoading] = useState(true);
        useEffect(() => {
            const boot = async () => {
                try {
                    const apiClient = new ApiClient();
                    const bootApiResponse = await apiClient.boot();
                    if (bootApiResponse.totalUsers === 0) {
                        router.push("/firstRun");
                        return;
                    } else if (bootApiResponse.verified === false) {
                        router.push("/login");
                    }
                    setLoading(false);
                } catch (err) {
                    router.push("/error");
                    console.error(err);
                }
            }

            boot();

        }, [])
        useEffect(() => {

        }, [])
        if (loading == true) {
            return (<div />)
        }
        return <Component />;
    }
    return Wrapper;
}
export default authenticatedRoute;