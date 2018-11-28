import {
  Primitive,
} from '@zcorky/is';

export type JSON = Primitive | object | any[];

export interface Diff {
  type: Type;
  prev: JSON;
  next: JSON;
};

export enum Type {
  CREATE = 0, // 'CREATE'
  UPDATE = 1, // 'UPDATE'
  DELETE = 2, // 'DELETE'
  UNCHANGE = 3, // 'UNCHANGE'
}
