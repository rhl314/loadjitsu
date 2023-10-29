import { useEffect, useState } from "react"
import { Pagination } from "react-bootstrap";
import { ApiClient } from "../../../api_client/api_client";
import { RunDocument, runTypeFromJSON, runTypeToJSON } from "../../ipc/run_document";
import TestIcon from "./TestIcon";
import Link from "next/link";
import _ from "lodash";

export default function PaginatedDocuments() {
    const [page, setPage] = useState(1)
    const limit = 8;
    const [total, setTotal] = useState(0);
    const [runDocuments, setRunDocuments] = useState<RunDocument[]>([]);
    const [runningMap, setRunningMap] = useState<Record<string, string>>({});
    const [state, setState] = useState('IDLE');
    const loadDocuments = async (currentPage: number) => {
        const apiClient = new ApiClient();
        const runDocumentsOrError = await apiClient.getDocuments(currentPage, limit);
        if (runDocumentsOrError.isFailure) {
            setState('ERROR');
            return;
        }
        setRunDocuments(runDocumentsOrError.getValue().documents);
        setTotal(runDocumentsOrError.getValue().total);
        setPage(runDocumentsOrError.getValue().page);
        setRunningMap(runDocumentsOrError.getValue().runningDocuments);
    }
    const documentButton = (runDocument: RunDocument) => {
        if (!_.isNil(runningMap[runDocument.uniqueId])) {
            return <div className="btn btn-outline-success btn-sm w-100">Running</div>
        }
        return (
            <div className="btn btn-outline-primary btn-sm w-100">Edit and Run</div>
        )
    }
    useEffect(() => {
        loadDocuments(page)
    }, []);
    const pageItems = () => {
        let items = [];
        for (let number = 1; number <= total / limit; number++) {
            items.push(
                <Pagination.Item onClick={() => {
                    loadDocuments(number)
                }} key={number} active={number === page}>
                    {number}
                </Pagination.Item>,
            );
        }
        return items;
    }
    if (runDocuments.length == 0) {
        return (
        <div className="alert alert-warning">
            Choose a target to run your first load test 
        </div>
        )
    }
    return (
        <div className="row">
            <div className="col-12">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Type</th>
                            <th scope="col">Title</th>
                            <th scope="col">Edit and Run</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            runDocuments.map((runDocument) => {
                                return (
                                    <tr key={runDocument.uniqueId}>
                                        <td>
                                            <div style={{ width: '20px' }}>
                                                <TestIcon type={runDocument.type} />
                                            </div>
                                        </td>
                                        <td>{runDocument.title}</td>
                                        <td>
                                            <Link href={`/run/${runTypeToJSON(runDocument.type)}/${runDocument.uniqueId}`} passHref={true}>
                                                {documentButton(runDocument)}
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>

                </table>
                <Pagination size="sm">{pageItems()}</Pagination>
            </div>
        </div>

    )
}