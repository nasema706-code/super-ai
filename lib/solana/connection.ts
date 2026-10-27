import { Connection } from "@solana/web3.js";
import { solanaRpcUrl } from "@/lib/solana/rpc";

let connection: Connection | null = null;

export function getConnection() {
  if (!connection) {
    connection = new Connection(solanaRpcUrl(), "confirmed");
  }
  return connection;
}
