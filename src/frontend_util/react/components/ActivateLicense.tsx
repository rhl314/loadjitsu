import * as _ from "lodash";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ApiClient } from "../../../api_client/api_client";
interface IFormState {
    key: string;
    error: string;
    status: string;
}
export default function ActivateLicense(props: { onClose: { (): void }, onSuccess: { (): void } }) {
    const [formState, setFormState] = useState<IFormState>({
        key: "",
        error: "",
        status: "IDLE",
    })
    const handleClose = () => {
        props.onClose();
    }
    const activate = async () => {
        if (_.isEmpty(_.trim(formState.key))) {
            setFormState({
                ...formState,
                status: "ERROR",
                error: "Please provide a license key",
            })
            return;
        }
        setFormState({
            ...formState,
            status: "PROCESSING"
        })
        const apiClient = new ApiClient();
        const activationStateOrError = await apiClient.activateLicense(_.trim(formState.key));
        if (activationStateOrError.isSuccess) {
            const activationState = activationStateOrError.getValue();
            if (activationState === "ACTIVE") {
                props.onSuccess();
            }
            setFormState({
                ...formState,
                status: "SUCCESS"
            })
            return;
        }

        const error = activationStateOrError.error;
        setFormState({
            ...formState,
            status: "ERROR",
            error: error?.message || "Something went wrong. Please try again"
        })
    }

    const statusMessage = () => {
        if (formState.status === "SUCCESS") {
            return (
                <div className="alert alert-success mt-4">
                    Your license has been activated successfuly.
                </div>
            )
        } else if (formState.status === "ERROR") {
            return (<div className="alert alert-warning mt-4">
                {formState.error}
            </div>)
        }
    }

    const cta = () => {
        if (formState.status === 'PROCESSING') {
            return (
                <Button variant="primary">
                    Activating. Please wait ...
                </Button>
            )
        } else {
            return (
                <Button variant="primary" onClick={activate}>
                    Activate
                </Button>
            )
        }
    }
    return (
        <Modal show={true} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Activate </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input onChange={(event: any) => {
                    setFormState({
                        ...formState,
                        key: event?.target?.value,
                    });
                }} className="form-control form-control-lg" type="text" placeholder="Provide a license key" />
                <div className="mt-4"></div>
                <a target={"_blank"} rel={"noreferrer"} href="https://loadjitsu.com/buy">You can purchase a license here</a>

                {statusMessage()}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {cta()}
            </Modal.Footer>
        </Modal>
    )
}