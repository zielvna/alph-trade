import { Position } from "../artifacts/ts/types";

export type PositionWithIndex = {
  index: bigint;
} & Position;
