import { useState, useEffect } from "react";
import { Notification, Modal, Button } from "rsuite";
import { useAlert } from "../../providers/AlertProvider";

const AlertPopup = () => {
  const { text, type, header, modal, dismiss, setAlert } = useAlert();
  const [open, setOpen] = useState();
  const reset = () => {
    setTimeout(() => {
      setAlert("", "", "", null);
    }, 300);
  };

  useEffect(() => {
    if (type === "modal") setOpen(true);
  }, [type]);

  if (dismiss && dismiss > 0) {
    setTimeout(() => {
      reset();
    }, Math.max(0, dismiss-300));
  }

  return (
    <>
      {text && type && header && type !== "modal" && (
        <Notification
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
          }}
          type={type}
          header={header}
          closable
          onClose={reset}
        >
          {text}
        </Notification>
      )}
      {type === "modal" && (
        <Modal open={open}>
          <Modal.Header>
            <Modal.Title>{header}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{text}</Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setOpen(false);
                reset();
                if (typeof modal.yesCallback === "function") modal.yesCallback();
              }}
              appearance="primary"
            >
              {modal.yes || "Ok"}
            </Button>
            {modal.no && (
              <Button
                onClick={() => {
                  setOpen(false);
                  reset();
                  if (typeof modal.noCallback === "function") modal.noCallback();
                }}
                appearance="subtle"
              >
                {modal.no}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default AlertPopup;
