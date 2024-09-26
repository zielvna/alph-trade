import { useTxStatus } from "@alephium/web3-react";
import { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { SNACKBAR_TIMEOUT } from "../utils/consts";

interface Props {
  id: number;
  message: string;
  txId?: string;
}

export const Snackbar: React.FC<Props> = ({ id, message, txId }) => {
  const { removeSnackbar } = useStore();
  const [dotsNumber, setDotsNumber] = useState(0);
  const status = useTxStatus(txId ?? "");

  useEffect(() => {
    if (!txId || status.txStatus?.type === "Confirmed") {
      setTimeout(() => {
        removeSnackbar(id);
      }, SNACKBAR_TIMEOUT);
    }
  }, [txId, status, id, removeSnackbar]);

  useEffect(() => {
    setTimeout(() => {
      setDotsNumber(dotsNumber === 3 ? 0 : dotsNumber + 1);
    }, 1000);
  }, [dotsNumber]);

  const txStatus = status.txStatus?.type.toString().toLowerCase();
  const dots =
    txStatus === "mempooled" ? new Array(dotsNumber).fill(".").join("") : "";

  return (
    <div className="w-[240px] border border-black bg-white p-2 flex flex-col">
      {message}
      {txId && txStatus && `: ${txStatus}${dots}`}
    </div>
  );
};
